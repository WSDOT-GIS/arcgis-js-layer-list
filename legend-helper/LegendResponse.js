/*global define*/

define(function () {
	/**
	 * Represents an item in a layer's legend.
	 * @class
	 */
	function LegendItem(/**{Object}*/ json) {
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
	 * Returns a data URL for the legend item's image.
	 * @returns {string} Data URL of an image.
	 */
	LegendItem.prototype.getDataUrl = function () {
		return ["data:", this.contentType, ";base64,", this.imageData].join("");
	};

	/**
	 * Creates a table row representation of a legend item.
	 * @returns {HTMLTableRowElement}
	 */
	LegendItem.prototype.toHtmlTableRow = function () {
		var output, cell, img;
		if (document && document.createElement) {
			output = document.createElement("tr");

			// Create image cell
			cell = document.createElement("td");
			output.appendChild(cell);
			img = document.createElement("img");
			img.src = this.getDataUrl();
			if (this.label) {
				img.alt = this.label;
			}
			if (this.height) {
				img.height = this.height;
			}
			if (this.width) {
				img.width = this.width;
			}
			cell.appendChild(img);

			// Create label cell
			cell = document.createElement("td");
			if (this.label) {
				cell.textContent = this.label;
			}
			output.appendChild(cell);

			// Create values cell.
			cell = document.createElement("td");
			if (this.values) {
				cell.textContent = this.values.toString();
			}
			output.appendChild(cell);
		}


		return output;
	};

	/**
	 * Represents a layer of a map service.
	 */
	function LegendLayer(/**{Object}*/ json) {
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
	 * Creates an HTML table for a legend layer.
	 * @returns {HTMLTableElement}
	 */
	LegendLayer.prototype.createHtmlTable = function () {
		var table, tbody;
		if (document && document.createElement && this.legend && this.legend.length > 0) {
			table = document.createElement("table");
			table.classList.add("legend");
			tbody = document.createElement("tbody");
			table.appendChild(tbody);
			this.legend.forEach(function (legendItem) {
				var row = legendItem.toHtmlTableRow();
				tbody.appendChild(row);
			});
		}
		return table;
	};

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

	/**
	 * Creates an array of HTML tables with a layer's legend.
	 * Array ordinals correspond to layer IDs. 
	 * Some elements may be undefined if there is no corresponding layer.
	 * @return {HTMLTableElement[]}
	 */
	LegendResponse.prototype.createHtmlTables = function () {
		var tables = [];
		this.layers.forEach(function (legendLayer) {
			var table = legendLayer.createHtmlTable();
			tables[legendLayer.layerId] = table;
		});
		return tables;
	};

	LegendResponse.parseJson = parseJson;

	LegendResponse.LegendLayer = LegendLayer;

	LegendResponse.LegendItem = LegendItem;


	return LegendResponse;
});