
/*global require*/
require(["esri/arcgis/utils",
	"esri/config",
	"dojo/text!./webmap.json"
], function (arcgisUtils, esriConfig, webmap) {
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
		var layerId;

		// Turn on some layers that are off by default.
		(function () {
			var airportRe = /^((Airport)|(CityLimits))/i, layer;
			for (var i = 0, l = map.layerIds.length; i < l; i += 1) {
				layerId = map.layerIds[i];
				if (airportRe.test(layerId)) {
					layer = map.getLayer(layerId);
					layer.show();
				}
			}
		}());

	});
});