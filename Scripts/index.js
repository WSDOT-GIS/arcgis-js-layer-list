
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
		function setLayerVisibility(e) {
			var layer = map.getLayer(this.value);
			if (this.checked) {
				layer.show();
			} else {
				layer.hide();
			}
			console.debug(layer);
		}

		function createLayerList(opLayers) {
			var list = document.createElement("ul");
			opLayers.forEach(function (opLayer) {
				console.log(opLayer);
				var item = document.createElement("li");
				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.checked = opLayer.layerObject.visible;
				var label = document.createElement("label");
				item.appendChild(label);
				label.appendChild(checkbox);
				label.appendChild(document.createTextNode(opLayer.title));
				checkbox.value = opLayer.id;
				list.appendChild(item);
				checkbox.addEventListener("click", setLayerVisibility);
			});
			return list;
		}

		var map = response.map;
		var opLayers = response.itemInfo.itemData.operationalLayers;
		var layerId;

		var list = createLayerList(opLayers);
		document.getElementById("layerlist").appendChild(list);
	});
});