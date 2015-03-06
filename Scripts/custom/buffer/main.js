
/*global define*/
define([
	"./units"
], function (Unit) {
	"use strict";

	function BufferUI(domNode) {
		var label, self = this;
		this.domNode = domNode;
		this.selectedGeometry = null;

		var form = document.createElement("form");
		form.classList.add("buffer-ui");
		this.form = form;
		var div;

		div = document.createElement("div");
		form.appendChild(div);
		label = document.createElement("label");
		div.appendChild(label);
		label.appendChild(document.createTextNode("Distances"));

		var distancesBox = document.createElement("input");
		label.appendChild(distancesBox);
		this.distancesBox = distancesBox;
		distancesBox.required = true;
		distancesBox.placeholder = "Enter a number(s)";
		distancesBox.pattern = /\d+(?:\.\d+)?([,\s]+\d+(?:\.\d+)?)*/.source;
		distancesBox.title = "Must be a number or list of numbers.";

		div = document.createElement("div");
		form.appendChild(div);
		label = document.createElement("label");
		div.appendChild(label);
		label.appendChild(document.createTextNode("Measurement Unit"));

		var unitSelect = Unit.createUnitSelect();
		unitSelect.name = "unit";
		label.appendChild(unitSelect);


		div = document.createElement("div");
		var submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.textContent = "Buffer";

		form.appendChild(div);

		div.appendChild(submitButton);

		form.onsubmit = function () {
			var evt = new CustomEvent('buffer', {
				detail: {
					distances: self.getDistances()
				}
			});
			form.dispatchEvent(evt);
			return false;
		};

		this.domNode.appendChild(form);

	}

	BufferUI.prototype.getDistances = function () {
		var s = this.distancesBox.value;
		var distances = s.split(/[,\s]+/).map(function (st) {
			return parseFloat(st);
		});
		return distances;
	}

	return BufferUI;
});