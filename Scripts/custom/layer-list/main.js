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

		var setOpacity = function () {
			var item = this.parentElement;
			var event = new CustomEvent('opacity-change', {
				detail: {
					layerId: item.dataset.layerId,
					opacity: this.value
				}
			});

			self.root.dispatchEvent(event);
		};

		operationalLayers.forEach(function (opLayer) {
			console.log(opLayer);
			var item = document.createElement("li");
			item.dataset.layerType = opLayer.layerType;
			item.dataset.itemId = opLayer.itemId;
			item.dataset.layerId = opLayer.id;

			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = opLayer.visibility;
			checkbox.value = opLayer.id;

			var label = document.createElement("label");
			item.appendChild(label);
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode(opLayer.title));
			domNode.appendChild(item);

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
		});
	}

	return LayerList;
});