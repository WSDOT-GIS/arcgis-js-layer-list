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
		this._map = null;
		this.selectedGeometry = null;

		this.root.appendChild(form);

		form.onsubmit = function () {
			var evt = new CustomEvent('buffer', {
				detail: {
					distances: self.getDistances(),
					unit: parseInt(self.form.unit.value, 10),
					spatialReference: self.getBufferSpatialReference()
				}
			});
			form.dispatchEvent(evt);
			return false;
		};

		this.form = form;

		this.root.appendChild(form);

	}

	BufferUI.prototype.setMap = function (map) {
		this._map = map;
	};

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
		return distances;
	};

	BufferUI.prototype.getBufferSpatialReference = function () {
		var bufferSRBox = this.form.bufferSpatialReference;
		return bufferSRBox.value ? { wkid: parseInt(bufferSRBox.value, 10) } : null;
	};

	return BufferUI;
});