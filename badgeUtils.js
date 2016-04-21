define(["./miscUtils"], function (miscUtils) {
    "use strict";

    /**
     * @module badgeUtils
     */

    var exports = {}

    /**
     * Creates an HTML span with classes applied.
     * @param {...string} classNames - One or more class names to be added to the span.
     * @returns {HTMLSpanElement} Returns the HTML span element that can be styled into a badge.
     */
    exports.createBadge = function () {
        var badge = document.createElement("span");
        badge.classList.add("badge");

        for (var i = 0, l = arguments.length; i < l; i += 1) {
            badge.classList.add(arguments[i]);
        }

        return badge;
    }

    /**
     * Creates a CSS class name based on a operationalLayers elements' layerType value.
     * @param {string} layerType - The layer type's name
     * @returns {string} A string that can be used as a CSS class name.
     */
    exports.createLayerTypeClass = function (layerType) {
        var words = miscUtils.splitWords(layerType, /(?:(?:ArcGIS)|(?:[A-Z][a-z]+))/g);
        words = words.map(function (w) {
            return w.toLowerCase();
        });
        return words.join("-");
    }

    /**
     * Creates a span element with a layer type class and "badge" class.
     * @param {string} layerType - Layer type name
     * @returns {HTMLSpanElement} An HTML span element that can be transformed into a badge via CSS.
     */
    exports.createLayerTypeBadge = function (layerType) {
        return exports.createBadge(["layer", "type", exports.createLayerTypeClass(layerType)].join("-"));
    }

    return exports;
});