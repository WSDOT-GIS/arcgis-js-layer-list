/*global define*/
define([
	"esri/request",
	"dojo/Deferred",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/FeatureLayer",
], function (esriRequest, Deferred, ArcGISDynamicMapServiceLayer, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer) {

	/**
	 * @external PortalItem
	 * @see {@link https://developers.arcgis.com/javascript/jsapi/portalitem-amd.html esri/arcgis/Portal/PortalItem}
	 */

	/**
	 * @external Layer
	 * @see {@link https://developers.arcgis.com/javascript/jsapi/layer-amd.html esri/layers/layer}
	 */

	/**
	 * @external PopupInfo
	 * @see http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/popupInfo/02r300000042000000/
	 */

	/**
	 * @typedef PortalItemDataLayer
	 * @property {number} id
	 * @property {external:PopupInfo} popupInfo
	 */

	/**
	 * @typedef PortalItemData
	 * @property {PortalItemDataLayer[]} layers
	 */

	/**
	 * @typedef {Object} ItemResponse
	 * @property {external:PortalItem} item
	 * @property {?PortalItemData} itemData - If present, contains additional information about an item, such as how a layer's popup should look.
	 *
	 */

	/**
	 * Gets the appropriate constructor for the layer type.
	 * @param {ItemResponse} itemResponse
	 * @returns {dojo/Deferred} - The event handler will have a constructor function parameter.
	 */
	function getConstructor(itemResponse) {
		var layerType, constructor, deferred;

		if (!itemResponse) {
			throw new TypeError("The itemResponse parameter cannot be null or undefined.");
		}

		deferred = new Deferred();

		var item = itemResponse.item;

		layerType = item.type;
		if (layerType === "Map Service") {
			// Determine if the map service layer is tiled or dynamic.
			esriRequest({
				url: item.url,
				content: {
					f: "json"
				}
			}).then(function (mapServiceResponse) {
				var constructor = mapServiceResponse.singleFusedMapCache ? ArcGISTiledMapServiceLayer : ArcGISDynamicMapServiceLayer;
				deferred.resolve({
					constructor: constructor,
					itemResponse: itemResponse
				});
			}, function (error) {
				error.itemResponse = itemResponse;
				deferred.reject(error);
			});
			constructor = ArcGISDynamicMapServiceLayer;
		} else {
			if (layerType === "Feature Service") {
				constructor = FeatureLayer;
			} else if (layerType === "Image Service") {
				constructor = ArcGISImageServiceLayer;
				//else if (layerType === "KML") {

				//} else if (layerType === "WMS") {

				//} else if (layerType === "Feature Collection") {

				//} else if (layerType === "Geodata Service") {

				//} else if (layerType === "Globe Service") {

				//}
			}

			if (constructor) {
				deferred.resolve({
					constructor: constructor,
					itemResponse: itemResponse
				});
			} else {
				deferred.reject(layerType + " type not supported.");
			}
		}

		return deferred;
	}


	/**
	 * Creates a layer 
	 * @param {ItemResponse} itemResponse
	 * @returns {dojo/Deferred} - The event handler will have a {external:Layer} parameter.
	 */
	function createLayer(itemResponse) {
		var deferred = new Deferred();

		getConstructor(itemResponse).then(function (constructorResponse) {
			var constructor = constructorResponse.constructor;
			var itemResponse = constructorResponse.itemResponse;

			var layer = new constructor(itemResponse.item.url, {
				id: itemResponse.item.id,
				title: itemResponse.item.title
			});

			deferred.resolve({
				layer: layer,
				itemResponse: itemResponse
			});
		}, function (error) {
			deferred.reject(error);
		});

		return deferred;
	}

	return {
		getConstructor: getConstructor,
		createLayer: createLayer
	};
});