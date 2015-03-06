
/*global define*/
define([
	"./units"
], function (Unit) {
	"use strict";


	function BufferUI(domNode) {
		var label;
		this.domNode = domNode;

		var form = document.createElement("form");
		form.classList.add("buffer-ui");
		var div;

		div = document.createElement("div");
		form.appendChild(div);
		label = document.createElement("label");
		div.appendChild(label);
		label.appendChild(document.createTextNode("Distances"));

		var distancesBox = document.createElement("input");
		label.appendChild(distancesBox);
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
			return false;
		};

		this.domNode.appendChild(form);

	}

	return BufferUI;
});