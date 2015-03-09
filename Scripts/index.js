
/*global require*/
require([
	"esri/config",
	"esri/arcgis/utils",
	"buffer",
	"epsg_io",
	"dojo/text!epsg_io/WA_prj_cs.json"
], function (esriConfig, arcgisUtils, BufferUI, epsg_io, projections) {
	var buffer;

	projections = epsg_io.parse(projections);

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

	buffer.addProjections(projections.results);

	// Create a map from a predefined webmap on AGOL.
	arcgisUtils.createMap("927b5daaa7f4434db4b312364489544d", "map").then(function (response) {
		var map = response.map;
		var popup = map.infoWindow;

		buffer.setMap(map);

		buffer.form.addEventListener("buffer", function (e) {
			console.debug("buffer event triggered", e);
		});

		/**
		 * Gets the currently selected feature.
		 * @param {Event} e
		 * @param {InfoWindow} e.target
		 * @param {Graphic[]} e.target.features
		 * @param {number} e.target.count
		 * @param {number} e.target.selectedIndex
		 */
		function getSelectedFeature(e) {
			var features = e.target.features;
			var count = e.target.count;
			var selectedIndex = e.target.selectedIndex;

			var output = null;
			if (features && count) {
				output = features[selectedIndex].toJson();
			}
			return output;
		}

		/**
		 * @typedef SelectionChangeEvent
		 * @property {InfoWindow} target
		 */

		popup.on("selection-change", function (e) {
			console.debug("selection-change", getSelectedFeature(e));
			buffer.selectedGeometry = getSelectedFeature(e);
		});

		popup.on("clear-features", function (e) {
			console.debug("clear-features", getSelectedFeature(e));
			buffer.selectedGeometry = getSelectedFeature(e);
		});

	});
});