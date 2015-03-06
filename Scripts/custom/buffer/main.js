
/*global define*/
define([
	"./units"
], function (Unit) {
	"use strict";

	function GeometryControls() {
		this.domNode = document.createElement("div");

		var label = document.createElement("label");
		label.textContent = "Geometries";
		this.domNode.appendChild(label);

		var fromIWButton = document.createElement("button");
		fromIWButton.type = "button";
		fromIWButton.disabled = true;
		fromIWButton.textContent = "Add from InfoWindow";
		fromIWButton.title = "Add graphic currently selected in info window.";
		fromIWButton.dataset.geometry = null;

		this.domNode.appendChild(fromIWButton);
		this.addFromInfoWindowButton = fromIWButton;
	}

	GeometryControls.prototype.setInfoWindowGeometry = function (geometry) {
		this.addFromInfoWindowButton.dataset.geometry = geometry || null;
	};

	function BufferUI(domNode) {
		var label, self = this;
		this.domNode = domNode;
		this._map = null;
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
		this.unitSelect = unitSelect;
		label.appendChild(unitSelect);

		div = document.createElement("div");
		label = document.createElement("label");
		label.textContent = "Buffer spatial reference";
		this.bufferSRBox = document.createElement("input");
		this.bufferSRBox.type = "number";
		this.bufferSRBox.value = 2927;
		label.appendChild(this.bufferSRBox);
		div.appendChild(label);
		form.appendChild(div);
		
		this.geometryControls = new GeometryControls();

		
		form.appendChild(this.geometryControls.domNode);

		div = document.createElement("div");
		var submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.textContent = "Buffer";

		form.appendChild(div);

		div.appendChild(submitButton);

		form.onsubmit = function () {
			var evt = new CustomEvent('buffer', {
				detail: {
					distances: self.getDistances(),
					units: parseInt(self.unitSelect.value, 10)
				}
			});
			form.dispatchEvent(evt);
			return false;
		};

		this.domNode.appendChild(form);

	}

	BufferUI.prototype.setMap = function (map) {
		this._map = map;
	};

	BufferUI.prototype.getDistances = function () {
		var s = this.distancesBox.value;
		var distances = s.split(/[,\s]+/).map(function (st) {
			return parseFloat(st);
		});
		return distances;
	};

	return BufferUI;
});