/*global define*/

define(function () {
    /**
     * @module LegendItem
     */

    /**
     * Represents an item in a layer's legend.
     * @class
     * @alias module:LegendItem
     * @param {Object} json - Initializes member values.
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

    return LegendItem;
});