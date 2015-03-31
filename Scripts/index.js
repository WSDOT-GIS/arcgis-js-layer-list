
/*global require*/
require(["esri/arcgis/utils",
	"esri/config",
	"layer-list",
	"dojo/text!./webmap.json"
], function (arcgisUtils, esriConfig, LayerList, webmap) {
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
		list.root.addEventListener("layer-visibility-change", function (e) {
			var layer = map.getLayer(e.detail.layerId);
			if (e.detail.visible) {
				layer.show();
			} else {
				layer.hide();
			}
		});
	});
});