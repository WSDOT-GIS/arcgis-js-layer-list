define(["./miscUtils"], function (miscUtils) {
    "use strict";

    /**
     * @module SublayerList
     */

    /**
     * A list of a map service's sublayers.
     * @class
     * @alias module:SublayerList
     * @param {esri/layers/Layer} layer - A layer.
     */
    function SublayerList(layer) {

        /**
         * Creates a sublayer list item representing a layer info.
         * @param {esri/layers/LayerInfo} layerInfo - A LayerInfo object.
         * @returns {HTMLLIElement} A sublayer list item representing the input layer info object.
         */
        function createSublayerListItem(layerInfo) {
            var li = document.createElement("li");


            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = miscUtils.arrayContains(layer.visibleLayers, layerInfo.id);

            li.dataset.defaultVisibility = layerInfo.defaultVisibility;
            li.dataset.id = layerInfo.id;
            li.dataset.maxScale = layerInfo.maxScale;
            li.dataset.minScale = layerInfo.minScale;
            ////li.dataset.name = layerInfo.name;
            li.dataset.parentLayerId = layerInfo.parentLayerId === -1 ? "" : layerInfo.parentLayerId;
            li.dataset.subLayerIds = layerInfo.subLayerIds ? layerInfo.subLayerIds : "";

            li.appendChild(checkbox);
            var label = document.createElement("label");
            label.textContent = layerInfo.name;
            li.appendChild(label);

            var sublayerList;
            // If the sublayer has child layers, add a list.
            if (layerInfo.subLayerIds && layerInfo.subLayerIds.length > 0) {
                sublayerList = document.createElement("ul");
                sublayerList.dataset.id = layerInfo.id;
                li.appendChild(sublayerList);
            }


            return li;
        }

        var self = this;

        /**
         * @member {HTMLUListElement} root
         */
        Object.defineProperty(this, "root", {
            value: document.createElement("ul")
        });

        this.root.classList.add("sublayer-list");

        if (layer.layerInfos) {
            layer.layerInfos.forEach(function (layerInfo) {
                var li = createSublayerListItem(layerInfo);
                var parentList;
                // If the layer info has no parent layer, add to the root list.
                if (layerInfo.parentLayerId === -1) {
                    parentList = self.root;
                } else {
                    parentList = self.root.querySelector(["ul[data-id='", layerInfo.parentLayerId, "']"].join(""));
                }
                if (parentList) {
                    parentList.appendChild(li);
                } else {
                    console.error("parent not found", { layer: layer, layerInfo: layerInfo });
                }
            });
        }
    }

    return SublayerList;

});