/*global define*/
define([
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/FeatureLayer",
], function (ArcGISDynamicMapServiceLayer, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer) {

	/**
	 * @external PortalItem
	 * @see {@link:https://developers.arcgis.com/javascript/jsapi/portalitem-amd.html esri/arcgis/Portal/PortalItem}
	 */

	/**
	 * @typedef FieldInfo
	 * @property {string} fieldName
	 * @property {Boolean} isEditable
	 * @property {string} label
	 * @property {string} stringFieldOption - E.g., "textbox"
	 * @property {string} tooltip - Note: can be an empty string.
	 * @property {Boolean} visible
	 */

	/**
	 * @typedef MediaInfo
	 */

	/**
	 * @typedef PopupInfo
	 * @property {?string} descriptoin
	 * @property {FieldInfo[]} fieldInfos
	 * @property {MediaInfos[]} mediaInfos
	 * @property {Boolean} showAttachments
	 * @property {string} title - The title to show on the popup.
	 */

	/**
	 * @typedef PortalItemDataLayer
	 * @property {number} id
	 * @property {PopupInfo} popupInfo
	 */

	/**
	 * @typedef PortalItemData
	 * @property {PortalItemDataLayer[]} layers
	 */

	/**
	 * @typedef {Object} itemResponse
	 * @property {external:PortalItem} item
	 * @property {PortalItemData} itemData
	 *
	 */

	function createLayer() {

	}

	return {
		createLayer: createLayer
	}
});