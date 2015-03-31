/*global define*/
define([], function () {
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
	 * @class
	 * @param {Object[]} operationalLayers
	 * @param {(HTMLUListElement|HTMLOListElement)} domNode
	 */
	function LayerList(operationalLayers, domNode) {
		var self = this;
		/** @member {(HTMLUListElement|HTMLOListElement)} */
		this.root = domNode;
		domNode.classList.add("layer-list");





		operationalLayers.forEach(function (opLayer) {
			var setLayerVisibility = function () {
				// Toggle the layer to match checkbox value.
				if (this.checked) {
					opLayer.layerObject.show();
				} else {
					opLayer.layerObject.hide();
				}
				////var event = new CustomEvent('layer-visibility-change', {
				////	detail: {
				////		layerId: this.value,
				////		visible: this.checked
				////	}
				////});

				////self.root.dispatchEvent(event);
			};

			var setOpacity = function () {
				////var item = this.parentElement;
				////var event = new CustomEvent('opacity-change', {
				////	detail: {
				////		layerId: item.dataset.layerId,
				////		opacity: this.value
				////	}
				////});

				////self.root.dispatchEvent(event);
				opLayer.layerObject.setOpacity(this.value);
			};

			var item = document.createElement("li");
			item.classList.add("layer-list-item");
			item.dataset.layerType = opLayer.layerType;
			item.dataset.itemId = opLayer.itemId;
			item.dataset.layerId = opLayer.id;

			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = opLayer.visibility;
			checkbox.value = opLayer.id;
			item.appendChild(checkbox);

			var label = document.createElement("label");
			label.classList.add("layer-label");
			label.appendChild(document.createTextNode(opLayer.title));
			item.appendChild(label);

			//domNode.appendChild(item);
			domNode.insertBefore(item, domNode.firstChild);

			checkbox.addEventListener("click", setLayerVisibility);

			var opacitySlider = document.createElement("input");
			opacitySlider.classList.add("opacity-slider");
			opacitySlider.type = "range";
			opacitySlider.min = 0;
			opacitySlider.max = 1;
			opacitySlider.step = 0.05;
			opacitySlider.value = opLayer.opacity;
			item.appendChild(opacitySlider);

			opacitySlider.addEventListener("change", setOpacity);

			var setVisibleLayers = function () {
				var checkedBoxes = item.querySelectorAll(".sublayer-list input:checked");
				var uncheckedBoxes = item.querySelectorAll(".sublayer-list input:not(:checked)");

				function getSubitems(checkboxes) {
					var subItems = [];
					var ds;
					for (var i = 0, l = checkboxes.length; i < l; i += 1) {
						ds = checkboxes[i].parentElement.dataset;
						subItems.push(dataSetToObject(ds));
					}
					return subItems;
				}

				var checkedItems = getSubitems(checkedBoxes);
				var uncheckedItems = getSubitems(uncheckedBoxes);
				var filteredChecked = [];
				var currentItem;

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
				for (var i = 0, l = checkedItems.length; i < l; i += 1) {
					currentItem = checkedItems[i];
					if (!currentItem.subLayerIds && !uncheckedContainsItem(currentItem)) {
						filteredChecked.push(currentItem.id);
					}
				}

				var event = new CustomEvent('set-visible-layers', {
					detail: {
						layerId: item.dataset.layerId,
						sublayerIds: filteredChecked
					}
				});

				opLayer.layerObject.setVisibleLayers(filteredChecked.length ? filteredChecked : [-1]);

				self.root.dispatchEvent(event);
			};

			var sublayerList, subChecks;
			if (opLayer.layerObject.layerInfos && opLayer.layerObject.setVisibleLayers) {
				sublayerList = new SublayerList(opLayer.layerObject);
				subChecks = sublayerList.root.querySelectorAll("input[type=checkbox]");
				for (var i = 0, l = subChecks.length; i < l; i += 1) {
					subChecks[i].addEventListener("click", setVisibleLayers);
				}
				item.appendChild(sublayerList.root);
			}

		});
	}

	return LayerList;
});