
/*global require*/
require(["esri/arcgis/utils",
	"esri/config",
	"esri/domUtils",
	"layer-list",
	"dojo/text!./webmap.json"
], function (arcgisUtils, esriConfig, domUtils, LayerList, webmap) {
	"use strict";

	// Specify CORS enabled servers.
	["www.wsdot.wa.gov", "wsdot.wa.gov", "gispublic.dfw.wa.gov"].forEach(function (svr) {
		esriConfig.defaults.io.corsEnabledServers.push(svr);
	});
	// Since CORS servers are explicitly specified, CORS detection is not necessary.
	// This prevents the following types of errors from appearing in the console:
	// XMLHttpRequest cannot load http://gis.rita.dot.gov/ArcGIS/rest/info?f=json. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://example.com' is therefore not allowed access. 
	esriConfig.defaults.io.corsDetection = false;

	webmap = JSON.parse(webmap);

	webmap = {
		item: {
			extent: [[-126.3619, 44.2285], [-114.3099, 50.0139]],
		},
		itemData: webmap
	};



	// Create a map from a predefined webmap on AGOL.
	arcgisUtils.createMap(webmap, "map").then(function (response) {
		var map = response.map;
		var opLayers = response.itemInfo.itemData.operationalLayers;

		var list = new LayerList(opLayers, document.getElementById("layerlist"));
		////list.root.addEventListener("layer-visibility-change", function (e) {
		////	var layer = map.getLayer(e.detail.layerId);
		////	if (e.detail.visible) {
		////		layer.show();
		////	} else {
		////		layer.hide();
		////	}
		////});

		////list.root.addEventListener("opacity-change", function (e) {
		////	var layer = map.getLayer(e.detail.layerId);
		////	layer.setOpacity(e.detail.opacity);
		////});

		////list.root.addEventListener("set-visible-layers", function (e) {
		////	console.log("set-visible-layers", e);
		////});

		map.on("zoom-end", function (e) {
			// TODO: Update layer list items to show if they are not visible due to zoom scale.
			console.debug("zoom-end", e);
		});

		map.on("update-start", function (e) {
			domUtils.show(document.getElementById("mapProgress"));
		});

		map.on("update-end", function () {
			domUtils.hide(document.getElementById("mapProgress"));
		});
	});
});