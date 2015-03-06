
/*global require*/
require(["esri/arcgis/utils", "buffer"], function (arcgisUtils, BufferUI) {
	var buffer = new BufferUI(document.getElementById("buffer"));

	arcgisUtils.createMap("927b5daaa7f4434db4b312364489544d", "map").then(function (response) {
		var map = response.map;
		var popup = map.infoWindow;

		buffer.setMap(map);

		buffer.form.addEventListener("buffer", function (e) {
			console.debug("buffer event triggered", e);
		});

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