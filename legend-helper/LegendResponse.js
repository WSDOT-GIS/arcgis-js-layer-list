/*global define*/

define(["./LegendItem", "./LegendLayer"], function (LegendItem, LegendLayer) {
    /**
     * @module LegendResponse
     */

    /**
     * The top level of a response for a Legend request.
     * @param {Object} json
     * @param {LegendLayer[]} json.layers
     * @class
     * @alias module:LegendResponse
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

    /**
     * Parses legend response text into a LegendResponse object.
     * @param {string} jsonString - Response from a map service legend request.
     * @returns {LegendResponse}
     */
    LegendResponse.parseJson = function (jsonString) {
        return JSON.parse(jsonString, jsonReviver);
    };

    return LegendResponse;
});