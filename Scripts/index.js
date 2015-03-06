
/*global require*/
require(["esri/arcgis/utils", "buffer"], function (arcgisUtils, Buffer) {
	arcgisUtils.createMap("927b5daaa7f4434db4b312364489544d", "map").then(function (response) {
		var map = response.map;
		var popup = map.infoWindow;

		/**
		 * @typedef SelectionChangeEvent
		 * @property {InfoWindow} target
		 */

		popup.on("selection-change", function (e) {
			console.debug("selection-change", e.target);
		});

		popup.on("clear-features", function (e) {
			console.debug("clear-features", e.target);
		});

		var buffer = new Buffer(document.getElementById("buffer"));
	});
});