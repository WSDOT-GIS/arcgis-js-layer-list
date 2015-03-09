
/*global require*/
require([
	"esri/config",
	"esri/arcgis/utils",
	"esri/graphic",
	"esri/geometry/jsonUtils",
	"esri/layers/FeatureLayer",
	"esri/geometry/geometryEngineAsync",
	"buffer",
	"buffer/BufferLinkInfoWindow"
], function (esriConfig, arcgisUtils, Graphic, geometryJsonUtils, FeatureLayer, geometryEngineAsync, BufferUI, BufferLinkInfoWindow) {
	var buffer, bufferFeatureLayer;

	bufferFeatureLayer = new FeatureLayer({
		featureSet: null,
		layerDefinition: {
			geometryType: "esriGeometryPolygon",
			fields: []
		}
	}, {
		className: "buffer"
	});

	// Specify CORS enabled servers.
	["www.wsdot.wa.gov", "wsdot.wa.gov", "gispublic.dfw.wa.gov"].forEach(function (svr) {
		esriConfig.defaults.io.corsEnabledServers.push(svr);
	});
	// Since CORS servers are explicitly specified, CORS detection is not necessary.
	// This prevents the following types of errors from appearing in the console:
	// XMLHttpRequest cannot load http://gis.rita.dot.gov/ArcGIS/rest/info?f=json. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://example.com' is therefore not allowed access. 
	esriConfig.defaults.io.corsDetection = false;
	
	// Create the Buffer UI in the specified node.
	buffer = new BufferUI(document.getElementById("buffer"));

	// Create a map from a predefined webmap on AGOL.
	arcgisUtils.createMap("927b5daaa7f4434db4b312364489544d", "map").then(function (response) {
		var map = response.map;
		map.addLayer(bufferFeatureLayer);

		BufferLinkInfoWindow.addBufferLink(map.infoWindow, buffer);

		buffer.form.addEventListener("buffer", function (e) {
			var detail = e.detail;

			geometryEngineAsync.buffer(detail.geometry, detail.distance, detail.unit, detail.unionResults).then(function (bufferResults) {
				console.log("buffer results", bufferResults);
				if (bufferResults) {
					bufferFeatureLayer.suspend();
					bufferResults.forEach(function (geometry) {
						var graphic = new Graphic(geometry);
						bufferFeatureLayer.add(graphic);
					});
					bufferFeatureLayer.resume();
				}
				buffer.clearGeometryList();
			}, function (error) {
				console.error("buffer error", error);
			});
		});
	});
});