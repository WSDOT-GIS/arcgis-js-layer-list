/*global define*/

define(["./LegendItem"], function (LegendItem) {
    /**
     * @module LegendLayer
     */

    /**
     * Represents a layer of a map service.
     * @class
     * @alias module:LegendLayer
     * @param {Object} json - Corresponds to members to initialize their values.
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

    return LegendLayer;
});