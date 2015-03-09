/*global define*/
define([
	"./units",
	"dojo/text!./Templates/BufferUI.min.html"
], function (Unit, template) {
	"use strict";

	/**
	 * Converts the template HTML markup string into an HTML DOM element, 
	 * then clones its form.
	 * @param {string} template - HTML markup string.
	 * @returns {HTMLFormElement}
	 */
	function getFormFromTemplate(template) {
		var parser = new DOMParser();
		var templateDoc = parser.parseFromString(template, "text/html");
		var form = templateDoc.querySelector("form").cloneNode(true);
		var unitSelect = form.unit;
		unitSelect.appendChild(Unit.createUnitSelectContents("Foot"));
		return form;
	}

	/**
	 * UI for the Buffer operation on an ArcGIS Server Geometry service.
	 * @class
	 */
	function BufferUI(domNode) {
		var self = this;
		var form = getFormFromTemplate(template);

		this.root = domNode;
		////this._map = null;
		////this.selectedGeometry = null;

		this.root.appendChild(form);


		form.onsubmit = function () {
			var geometries = self.getGeometries();
			if (geometries) {
				var evt = new CustomEvent('buffer', {
					detail: {
						geometry: self.getGeometries(),
						distance: self.getDistances(),
						unit: parseInt(self.form.unit.value, 10),
						unionResults: Boolean(self.form.querySelector("[name=union]:checked")),
					}
				});
				form.dispatchEvent(evt);
			}
			return false;
		};

		var clearGeometriesButton = this.root.querySelector("button.clear-geometries");
		clearGeometriesButton.onclick = function () { self.clearGeometryList(); };

		var clearGraphicsButton = this.root.querySelector("button.clear-result-graphics-button");
		clearGraphicsButton.onclick = function () {
			var evt = new CustomEvent('clear-graphics');
			form.dispatchEvent(evt);
		};

		this.form = form;

		this.root.appendChild(form);

	}

	/**
	 * Gets the distances entered in the distances box.
	 * @returns {number[]}
	 */
	BufferUI.prototype.getDistances = function () {
		var s, distances = null;
		s = this.form.distances.value;
		if (s) {
			distances = s.split(/[,\s]+/).map(function (st) {
				return parseFloat(st);
			});
		}
		if (distances.length === 1) {
			distances = distances[0];
		}
		return distances;
	};

	BufferUI.prototype.addFeature = function (feature) {
		var list = this.root.querySelector(".geometry-list");
		var li = document.createElement("li");

		function getGeometry(featureOrGeometry) {
			if (featureOrGeometry.geometry) {
				return featureOrGeometry.geometry;
			} else if (featureOrGeometry.hasOwnProperty("x") || featureOrGeometry.hasOwnProperty("points") || featureOrGeometry.hasOwnProperty("rings") || featureOrGeometry.hasOwnProperty("paths")) {
				return featureOrGeometry;
			}
		}

		var geometry = getGeometry(feature);
		if (geometry.toJson) {
			geometry = geometry.toJson();
		}
		li.dataset.geometry = JSON.stringify(geometry);
		li.textContent = "Geometry";
		list.appendChild(li);
	};

	BufferUI.prototype.getGeometries = function () {
		var geometries = [];
		var listItems = this.root.querySelectorAll(".geometry-list > li");
		var g;
		for (var i = 0, l = listItems.length; i < l; i += 1) {
			g = listItems[i].dataset.geometry;
			g = JSON.parse(g);
			geometries.push(g);
		}
		if (geometries.length < 1) {
			geometries = null;
		} else if (geometries.length === 1) {
			geometries = geometries[0];
		}
		return geometries;
	};

	BufferUI.prototype.clearGeometryList = function () {
		var ul = this.root.querySelector(".geometry-list");
		ul.innerHTML = "";
	};

	return BufferUI;
});