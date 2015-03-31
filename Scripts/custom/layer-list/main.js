/*global define*/
define([], function () {
	function LayerList(operationalLayers, domNode) {
		var self = this;
		this.root = domNode;
		domNode.classList.add("layer-list");

		var setLayerVisibility = function () {
			var event = new CustomEvent('layer-visibility-change', {
				detail: {
					layerId: this.value,
					visible: this.checked
				}
			});

			self.root.dispatchEvent(event);
		};

		operationalLayers.forEach(function (opLayer) {
			console.log(opLayer);
			var item = document.createElement("li");
			item.dataset.layerType = opLayer.layerType;
			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = opLayer.visibility;
			var label = document.createElement("label");
			item.appendChild(label);
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode(opLayer.title));
			checkbox.value = opLayer.id;
			domNode.appendChild(item);
			checkbox.addEventListener("click", setLayerVisibility);
		});
	}

	return LayerList;
});