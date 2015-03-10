/*global define*/
define([
	"esri/graphic",
	"esri/geometry/jsonUtils",
	"esri/layers/FeatureLayer",
	"esri/geometry/geometryEngineAsync"], function (
		 Graphic, geometryJsonUtils, FeatureLayer, geometryEngineAsync
		) {
	/**
	 * Adds a "buffer" link to an InfoWindow.
	 * When clicked it will add the selected feature
	 * to the BufferUI geometries list.
	 * @param {esri/widget/InfoWindow} infoWindow
	 * @param {BufferUI} bufferUI
	 */
	function addBufferLink(infoWindow, bufferUI) {
		var actionList = infoWindow.domNode.querySelector(".actionList");
		var link = document.createElement("a");
		var docFrag = document.createDocumentFragment();
		link.textContent = "Buffer";
		link.href = "#";
		link.title = "Add selected geometry to Buffer UI list";
		link.classList.add("action");
		link.classList.add("buffer");
		// Add a space before adding link.
		docFrag.appendChild(document.createTextNode(" "));
		docFrag.appendChild(link);

		link.onclick = function () {
			var feature = infoWindow.features[infoWindow.selectedIndex];
			bufferUI.addFeature(feature);

			return false;
		};

		actionList.appendChild(docFrag);
		return link;
	}

	function attachBufferUIToMap(map, buffer) {
		var bufferFeatureLayer, oid = 0;
		bufferFeatureLayer = new FeatureLayer({
			featureSet: null,
			layerDefinition: {
				geometryType: "esriGeometryPolygon",
				fields: [
					{
						name: "oid",
						type: "esriFieldTypeOID"
					},
					{
						name: "distance",
						type: "esriFieldTypeDouble"
					},
					{
						name: "unit",
						type: "esriFieldTypeInteger",
						alias: "Measurement Unit ID"
					},
					{
						name: "unioned",
						type: "esriFieldTypeSmallInteger",
						alias: "Is Unioned"
					}
				]
			}
		}, {
			className: "buffer"
		});


		map.addLayer(bufferFeatureLayer);

		addBufferLink(map.infoWindow, buffer);

		buffer.form.addEventListener('clear-graphics', function () {
			bufferFeatureLayer.clear();
		});

		buffer.form.addEventListener("buffer", function (e) {
			var detail = e.detail;

			// Convert regular objects into esri/Geometry objects.
			if (Array.isArray(detail.geometry)) {
				detail.geometry = detail.geometry.map(geometryJsonUtils.fromJson, detail.geometry);
			} else {
				detail.geometry = geometryJsonUtils.fromJson(detail.geometry);
			}

			// The geometry engine requires that the number of geometries and distances be the same.
			// If multiple distances are provided but only a single geometry, that geometry will be
			// buffered for each distance.
			if (Array.isArray(detail.distance) && !Array.isArray(detail.geometry)) {
				detail.geometry = (function () {
					var outGeoArray = [];
					for (var i = 0, l = detail.distance.length; i < l; i += 1) {
						outGeoArray[i] = detail.geometry;
					}
					return outGeoArray;
				}());
			} else if (!Array.isArray(detail.distance) && Array.isArray(detail.geometry)) {
				detail.distance = (function () {
					var outDistanceArray = [];
					for (var i = 0; i < detail.geometry.length; i++) {
						outDistanceArray[i] = detail.distance;
					}
					return outDistanceArray;
				}());
			}

			geometryEngineAsync.buffer(detail.geometry, detail.distance, detail.unit, detail.unionResults).then(function (bufferResults) {
				console.log("buffer results", bufferResults);
				if (bufferResults) {
					bufferFeatureLayer.suspend();
					if (!Array.isArray(bufferResults)) {
						bufferResults = [bufferResults];
					}
					bufferResults.forEach(function (geometry) {
						var graphic = new Graphic(geometry, null, {
							oid: oid++,
							distance: detail.distance,
							unit: detail.unit,
							unioned: detail.unionResults
						});
						bufferFeatureLayer.add(graphic);
					});
					bufferFeatureLayer.resume();
				}
				buffer.clearGeometryList();
			}, function (error) {
				console.error("buffer error", error);
			});
		});
	}

	return {
		addBufferLink: addBufferLink,
		attachBufferUIToMap: attachBufferUIToMap
	};
});