/*global define*/
define(["legend-helper"], function (LegendHelper) {
	"use strict";

	/**
	 * Represents an operation layer in a web map.
	 * @typedef {Object} OperationLayer
	 * @property {string} id - The ID that will be given to the layer when added to a map.
	 * @property {string} layerType - The type of layer.
	 * @property {string} url
	 * @property {Boolean} visibility
	 * @property {Number} opacity
	 * @property {string} title
	 * @property {string} itemId - ArcGIS Online item id
	 * @property {Number} minScale
	 * @property {Number} maxScale
	 */

	/**
	 * Creates an HTML span with classes applied.
	 * @param {...string} classNames - One or more class names to be added to the span.
	 * @returns {HTMLSpanElement}
	 */
	function createBadge() {
		var badge = document.createElement("span");
		badge.classList.add("badge");

		for (var i = 0, l = arguments.length; i < l; i += 1) {
			badge.classList.add(arguments[i]);
		}

		return badge;
	}

	/** Splits a camel-case or Pascal-case variable name into individual words.
	 * @param {string} s
	 * @param {RegExp} [re=/([A-Za-z]?)([a-z]+)/g]
	 * @returns {string[]}
	 */
	function splitWords(s, re) {
		var match, output = [];
		// re = /[A-Z]?[a-z]+/g
		if (!re) {
			re = /([A-Za-z]?)([a-z]+)/g;
		}

		/*
		matches example: "oneTwoThree"
		["one", "o", "ne"]
		["Two", "T", "wo"]
		["Three", "T", "hree"]
		*/

		match = re.exec(s);
		while (match) {
			// output.push(match.join(""));
			output.push(match[0]);
			match = re.exec(s);
		}

		return output;

	}

	/**
	 * Creates a CSS class name based on a operationalLayers elements' layerType value.
	 * @param {string} layerType
	 * @returns {string}
	 */
	function createLayerTypeClass(layerType) {
		var words = splitWords(layerType, /(?:(?:ArcGIS)|(?:[A-Z][a-z]+))/g);
		words = words.map(function (w) {
			return w.toLowerCase();
		});
		return words.join("-");
	}

	/**
	 * Creates a span element with a layer type class and "badge" class.
	 * @returns {HTMLSpanElement}
	 */
	function createLayerTypeBadge(/**{string}*/ layerType) {
		return createBadge(["layer", "type", createLayerTypeClass(layerType)].join("-"));
	}

	/**
	 * Parses a string containing comma-separated 
	 * integer values into an array of integers.
	 * @param {string} s
	 * @returns {number[]}
	 */
	function parseIntList(s) {
		var output = null;
		if (s) {
			output = s.split(",").map(function(i){
				return parseInt(i);
			});
		}
		return output;
	}

	/**
	 * Determines if an array contains a given value.
	 * @param {Array} array
	 * @param {*} value - The value to search for in the array.
	 * @returns {Boolean}
	 */
	function arrayContains(array, value) {
		var output = false;
		for (var i = 0; i < array.length; i++) {
			if (array[i] === value) {
				output = true;
				break;
			}
		}
		return output;
	}


	/**
	 * Converts an HTML Element's dataset into an object,
	 * parsing the string values into appropriate types.
	 * @param {DOMStringMap} dataset
	 * @returns {object}
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
					output[name] = val ? parseIntList(val) : null;
				} else if (boolPropsRe.test(name)) {
					output[name] = /true/i.test(dataset[name]);
				} else {
					output[name] = val;
				}
			}

		}
		return output;
	}

	/**
	 * @class
	 * @param {esri/layers/Layer} layer
	 * @member {HTMLUListElement} root
	 */
	function SublayerList(layer) {

		/**
		 * Creates a sublayer list item representing a layer info.
		 * @param {esri/layers/LayerInfo} layerInfo
		 * @returns {HTMLLIElement}
		 */
		function createSublayerListItem(layerInfo) {
			var li = document.createElement("li");
			

			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = arrayContains(layer.visibleLayers, layerInfo.id);
			
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

		this.root = document.createElement("ul");
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

	/**
	 * Creates an opacity slider for the given layer.
	 * @returns {HTMLInputElement}
	 */
	function createOpacitySlider(/**{OperationLayer}*/ opLayer) {
		var setOpacity = function () {
			opLayer.layerObject.setOpacity(this.value * 0.01);
		};

		var opacitySlider = document.createElement("input");
		opacitySlider.classList.add("opacity-slider");
		opacitySlider.type = "range";
		opacitySlider.min = 0;
		opacitySlider.max = 100;
		opacitySlider.step = 1;
		opacitySlider.value = opLayer.opacity * 100;
		opacitySlider.addEventListener("change", setOpacity);
		return opacitySlider;
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

		// Layers are displayed on the map in the OPPOSITE order
		// than what is listed in the webmap JSON.
		list.insertBefore(item, list.firstChild);

		checkbox.addEventListener("click", setLayerVisibility);

		var controlContainer = document.createElement("div");
		controlContainer.classList.add("control-container");
		item.appendChild(controlContainer);

		var opacitySlider = createOpacitySlider(opLayer);

		controlContainer.appendChild(opacitySlider);
		/**
		 * Set the layer's visible sublayers based on the corresponding
		 * checkboxes' checked state.
		 */
		var setVisibleLayers = function () {
			var checkedBoxes = item.querySelectorAll(".sublayer-list input:checked");
			var uncheckedBoxes = item.querySelectorAll(".sublayer-list input:not(:checked)");

			/**
			 * Get the sublayer info objects corresponding to 
			 * the given checkboxes.
			 * @param {HTMLInputElement[]} checkboxes - An array of checkbox input elements.
			 * @returns {Object[]}
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
			 * @param {Object} item
			 * @param {number} item.id - Integer identifier
			 * @returns {Boolean}
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
			console.log("legend response", {
				layer: opLayer,
				legend: legendResponse,
			});
			var tables = legendResponse.createHtmlTables();
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

		item.ondragend = function (e) {
			this.classList.remove("being-dragged");
			console.log("drag-end", e);
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

			layerList.insertBefore(draggedItem, this);

			return false;
		};

		return item;
	}

	/**
	 * @class
	 * @param {OperationLayer[]} operationalLayers
	 * @param {(HTMLUListElement|HTMLOListElement)} domNode
	 */
	function LayerList(operationalLayers, domNode) {
		/** @member {(HTMLUListElement|HTMLOListElement)} */
		this.root = domNode;
		domNode.classList.add("layer-list");

		operationalLayers.forEach(function (ol) {
			createLayerListItem(ol, domNode);
		});
	}

	/**
	 * Call this function to update the out-of-scale classes
	 * on layers.
	 * @param {number} scale
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