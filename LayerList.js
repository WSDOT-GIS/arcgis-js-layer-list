define(["legend-helper", "./LayerOptionsDialog", "./miscUtils", "./SublayerList"], function (LegendHelper, LayerOptionsDialog, miscUtils, SublayerList) {
    "use strict";

    /**
     * @module LayerList
     */

    /**
     * Creates an HTML span with classes applied.
     * @param {...string} classNames - One or more class names to be added to the span.
     * @returns {HTMLSpanElement} Returns the HTML span element that can be styled into a badge.
     */
    function createBadge() {
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
    function createLayerTypeClass(layerType) {
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
    function createLayerTypeBadge(layerType) {
        return createBadge(["layer", "type", createLayerTypeClass(layerType)].join("-"));
    }

    /**
     * Converts an HTML Element's dataset into an object, parsing the string values into appropriate types.
     * @param {DOMStringMap} dataset - An HTML element's dataset attribute.
     * @returns {object} An object representation of the input dataset, with property values converted to appropriate types.
     */
    function dataSetToObject(dataset) {
        var output = {};
        var intPropsRe = /^((id)|(m((ax)|(in))Scale)|(parentLayerId))$/i;
        var arrayPropsRe = /Ids$/i;
        var boolPropsRe = /defaultVisibility/i;
        var val;
        for (var name in dataset) {
            if (dataset.hasOwnProperty(name)) {
                val = dataset[name];

                if (intPropsRe.test(name)) {
                    output[name] = val ? parseInt(val) : null;
                } else if (arrayPropsRe.test(name)) {
                    output[name] = val ? miscUtils.parseIntList(val) : null;
                } else if (boolPropsRe.test(name)) {
                    output[name] = /true/i.test(dataset[name]);
                } else {
                    output[name] = val;
                }
            }

        }
        return output;
    }

    function createLayerOptionsButton(/**{OperationLayer}*/ opLayer) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = "Options";
        button.addEventListener("click", function () {
            LayerOptionsDialog.showLayerOptionsDialog(opLayer);
        });

        return button;
    }

    function createLayerListItem(opLayer, list) {
        var setLayerVisibility = function () {
            // Toggle the layer to match checkbox value.
            if (this.checked) {
                opLayer.layerObject.show();
            } else {
                opLayer.layerObject.hide();
            }
        };

        var item = document.createElement("li");
        item.classList.add("layer-list-item");
        item.classList.add("toggle-closed");
        item.dataset.layerType = opLayer.layerType;
        item.dataset.itemId = opLayer.itemId;
        item.dataset.layerId = opLayer.id;
        if (opLayer.layerDefinition) {
            item.dataset.minScale = opLayer.layerDefinition.minScale || "";
            item.dataset.maxScale = opLayer.layerDefinition.maxScale || "";
        } else {
            item.dataset.minScale = opLayer.minScale || "";
            item.dataset.maxScale = opLayer.maxScale || "";
        }

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = opLayer.visibility;
        checkbox.value = opLayer.id;
        item.appendChild(checkbox);

        var label = document.createElement("label");
        label.classList.add("layer-label");
        label.appendChild(document.createTextNode(opLayer.title));
        label.addEventListener("click", function () {
            item.classList.toggle("toggle-closed");
        });
        item.appendChild(label);

        badge = createLayerTypeBadge(opLayer.layerType);
        item.appendChild(badge);

        var optionsButton = createLayerOptionsButton(opLayer);
        item.appendChild(optionsButton);

        // Layers are displayed on the map in the OPPOSITE order
        // than what is listed in the webmap JSON.
        list.insertBefore(item, list.firstChild);

        checkbox.addEventListener("click", setLayerVisibility);

        var controlContainer = document.createElement("div");
        controlContainer.classList.add("control-container");
        item.appendChild(controlContainer);

        /**
         * Set the layer's visible sublayers based on the corresponding
         * checkboxes' checked state.
         */
        var setVisibleLayers = function () {
            var checkedBoxes = item.querySelectorAll(".sublayer-list input:checked");
            var uncheckedBoxes = item.querySelectorAll(".sublayer-list input:not(:checked)");

            /**
             * Get the sublayer info objects corresponding to the given checkboxes.
             * @param {HTMLInputElement[]} checkboxes - An array of checkbox input elements.
             * @returns {Object[]} An array of sublayer info objects.
             */
            function getSubitems(checkboxes) {
                var subItems = [];
                var ds;
                for (var i = 0, l = checkboxes.length; i < l; i += 1) {
                    ds = checkboxes[i].parentElement.dataset;
                    subItems.push(dataSetToObject(ds));
                }
                return subItems;
            }

            // Get the checked and unchecked checkboxes.
            var checkedItems = getSubitems(checkedBoxes);
            var uncheckedItems = getSubitems(uncheckedBoxes);


            var filteredChecked = [];
            var currentItem;

            /**
             * Determines if the collection of unchecked list items contains the given item.
             * @param {Object} item - item to search for
             * @param {number} item.id - Integer identifier
             * @returns {Boolean} Returns true if the collection of unchecked list items contains the input item, false otherwise.
             */
            function uncheckedContainsItem(item) {
                var output = false;
                var ucItem;
                for (var i = 0, l = uncheckedItems.length; i < l; i += 1) {
                    ucItem = uncheckedItems[i];
                    if (ucItem.subLayerIds) {
                        for (var j = 0, jl = ucItem.subLayerIds.length; j < jl; j += 1) {
                            if (item.id === ucItem.subLayerIds[j]) {
                                output = true;
                                break;
                            }
                        }
                    }
                    if (output) {
                        break;
                    }
                }
                return output;
            }

            // Filter out checked items with unchecked parents.
            // If the parent layer IDs are included, ArcGIS Server
            // will ignore the checked status of its sublayers.
            for (var i = 0, l = checkedItems.length; i < l; i += 1) {
                currentItem = checkedItems[i];
                if (!currentItem.subLayerIds && !uncheckedContainsItem(currentItem)) {
                    filteredChecked.push(currentItem.id);
                }
            }

            // Set the layer's visible sublayers to match the checkboxes.
            // If there are NO checked boxes, -1 is used to indicate this.
            // (This is because an empty array will indicate that all layers should be displayed.)
            opLayer.layerObject.setVisibleLayers(filteredChecked.length ? filteredChecked : [-1]);

            //self.root.dispatchEvent(event);
        };

        var sublayerList, subChecks, i, l, badge;
        if (opLayer.layerObject) {

            if (opLayer.layerObject.supportsDynamicLayers) {
                badge = createBadge("supports-dynamic-layers");
                item.insertBefore(badge, controlContainer);
            }

            if (opLayer.layerObject.layerInfos) {
                sublayerList = new SublayerList(opLayer.layerObject);
                subChecks = sublayerList.root.querySelectorAll("input[type=checkbox]");
                if (opLayer.layerObject.setVisibleLayers) {
                    for (i = 0, l = subChecks.length; i < l; i += 1) {
                        subChecks[i].addEventListener("click", setVisibleLayers);
                    }
                } else {
                    for (i = 0, l = subChecks.length; i < l; i += 1) {
                        subChecks[i].disabled = true;
                    }
                }
                controlContainer.appendChild(sublayerList.root);
            }
        }

        // Add legend
        LegendHelper.getLegendInfo(opLayer).then(function (legendResponse) {
            var tables;
            if (legendResponse.createHtmlTables) {
                tables = legendResponse.createHtmlTables();
                tables.forEach(function (table, i) {
                    var li;
                    if (table) {
                        li = sublayerList.root.querySelector(["[data-id='", i, "']"].join(""));
                        if (li) {
                            li.appendChild(table);
                        } else {
                            controlContainer.appendChild(table);
                        }

                    }
                });
            } else {
                console.log("TODO: Create feature layer legend", legendResponse);
            }
        }, function (error) {
            console.error("legend-error", {
                layer: opLayer,
                error: error
            });
        });


        // Make item draggable

        item.draggable = true;
        item.setAttribute("dropzone", "move string:text/plain");


        item.ondragstart = function (e) {
            this.classList.add("being-dragged");
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", this.dataset.layerId);
        };

        item.ondragover = function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            e.dataTransfer.dropEffect = "move";
            return false;
        };

        item.ondragenter = function () {
            this.classList.add("drag-target");
        };

        item.ondragleave = function () {
            this.classList.remove("drag-target");
        };

        item.ondragend = function () {
            this.classList.remove("being-dragged");
        };

        item.ondrop = function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            this.classList.remove("drag-target");
            // get the layer ID
            var layerId = e.dataTransfer.getData("text/plain");

            // Get the parent layer list.
            var layerList = this.parentElement;

            // Get the dragged item.
            var draggedItem = layerList.querySelector("[data-layer-id='" + layerId + "']");
            var moveEvent;

            if ((draggedItem.dataset.layerType === "ArcGISFeatureLayer" && this.dataset.layerType === "ArcGISFeatureLayer")
                ||
                (draggedItem.dataset.layerType !== "ArcGISFeatureLayer" && this.dataset.layerType !== "ArcGISFeatureLayer")
                ) {

                layerList.insertBefore(draggedItem, this);


                moveEvent = new CustomEvent("layer-move", {
                    detail: {
                        movedLayerId: layerId,
                        targetLayerId: this.dataset.layerId
                    }
                });

                layerList.dispatchEvent(moveEvent);
            } else {
                moveEvent = new CustomEvent("layer-cannot-move", {
                    detail: {
                        movedLayerId: layerId,
                        targetLayerId: this.dataset.layerId,
                        error: "Graphics layers are not allowed below non-graphics layers."
                    }
                });
            }

            return false;
        };

        return item;
    }

    /**
     * @class
     * @alias module:LayerList
     * @param {external:OperationLayer[]} operationalLayers - An array of operational layers.
     * @param {(external:HTMLUListElement|external:HTMLOListElement)} domNode - The root DOM node: either an UL or OL.
     */
    function LayerList(operationalLayers, domNode) {
        Object.defineProperties(this, {
            /** @member {(external:HTMLUListElement|external:HTMLOListElement)} */
            root: {
                value: domNode
            },
            /** @member {external:HTMLDialogElement} */
            dialog: {
                value: LayerOptionsDialog.createLayerOptionsDialog()
            }
        });
        document.body.appendChild(this.dialog);
        domNode.classList.add("layer-list");

        operationalLayers.forEach(function (ol) {
            createLayerListItem(ol, domNode);
        });
    }

    /**
     * Call this function to update the out-of-scale classes
     * on layers.
     * @param {number} scale - The new scale
     * @example
     * // map is an esri/Map object.
     * map.on("zoom-end", function () {
     *     // Update layer list items to show if they are not visible due to zoom scale.
     *     layerList.setScale(map.getScale());
     * });
     */
    LayerList.prototype.setScale = function (scale) {
        var items, item, i, l, minScale, maxScale;
        items = this.root.querySelectorAll("li[data-max-scale]");

        var cls = "out-of-scale";

        for (i = 0, l = items.length; i < l; i += 1) {
            item = items[i];
            minScale = parseInt(item.dataset.minScale, 10);
            maxScale = parseInt(item.dataset.maxScale, 10);
            if ((!minScale || minScale >= scale) && (!maxScale || maxScale <= scale)) {
                item.classList.remove(cls);
            } else {
                item.classList.add(cls);
            }
        }
    };

    return LayerList;
});