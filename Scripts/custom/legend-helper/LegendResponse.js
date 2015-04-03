/*global define*/

define(function () {
	/**
	 * Represents an item in a layer's legend.
	 */
	function LegendItem(json) {
		/**@member {string}*/
		this.label = json.label;
		/**@member {string}*/
		this.url = json.url;
		/**@member {string}*/
		this.imageData = json.imageData;
		/**@member {string}*/
		this.contentType = json.contentType;
		/**@member {number}*/
		this.height = json.height || null;
		/**@member {number}*/
		this.width = json.width || null;
		/**@member {number[]}*/
		this.values = json.values || null;
	}

	/**
	 * Represents a layer of a map service.
	 */
	function LegendLayer(json) {
		/**@member {number} */
		this.layerId = json.layerId;
		/**@member {string} */
		this.layerName = json.layerName;
		/**@member {string} */
		this.layerType = json.layerType;
		/**@member {?number}*/
		this.minScale = json.minScale;
		/**@member {?number}*/
		this.maxScale = json.maxScale;
		/**@member {LegendItem[]}*/
		this.legend = json.legend.map(function (o) {
			return new LegendItem(o);
		});
	}

	/**
	 * The top level of a response for a Legend request.
	 * @param {Object} json
	 * @param {LegendLayer[]} json.layers
	 * @class
	 */
	function LegendResponse(json) {
		/**@member {LegendLayer[]}*/
		this.layers = json.layers.map(function (o) {
			return new LegendLayer(o);

		});
	}

	function jsonReviver(k, v) {
		if (v && v.hasOwnProperty("layers")) {
			return new LegendResponse(v);
		}
		return v;
	}

	/**
	 * Parses legend response text into a LegendResponse object.
	 * @param {string} jsonString - Response from a map service legend request.
	 * @returns {LegendResponse}
	 */
	function parseJson(jsonString) {
		return JSON.parse(jsonString, jsonReviver);
	}

	LegendResponse.parseJson = parseJson;

	LegendResponse.LegendLayer = LegendLayer;

	LegendResponse.LegendItem = LegendItem;

	return LegendResponse;
});