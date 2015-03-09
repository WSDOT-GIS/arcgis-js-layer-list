/*global define*/
define(function () {
	"use strict";

	/**
	 * A coordinate system result from epsg.io.
	 */
	function CoordinateSystem(/**{object}*/searchResult) {
		/** @member {number} */
		this.accuracy = searchResult.accuracy;
		/** @member {string} */
		this.proj4 = searchResult.proj4;
		/** @member {string} */
		this.code = searchResult.code;
		/** @member {string} */
		this.name = searchResult.name;
		/** @member {string} */
		this.area = searchResult.area;
		/** @member {number[]} */
		this.bbox = searchResult.bbox;
		/** @member {(number[]|Transformation[])*/
		this.trans = searchResult.trans;
		/** @member {string}*/
		this.wkt = searchResult.wkt;
		/** @member {string}*/
		this.kind = searchResult.kind;
		/** @member {number}*/
		this.default_trans = searchResult.default_trans;
	}

	/**
	 * A transformation result from epsg.io.
	 */
	function Transformation(o) {
		/** @member {string}*/
		this.proj4 = o.proj4;
		/** @member {string}*/
		this.name = o.name;
		/** @member {string}*/
		this.area = o.area;
		/** @member {number[]}*/
		this.bbox = o.bbox;
		/** @member {number}*/
		this.code_trans = o.code_trans;
		/** @member {string}*/
		this.wkt = o.wkt;
		/** @member {number} */
		this.accuracy = o.accuracy;
	}

	/**
	 * 
	 * @param {Object} obj - An object
	 * @param {...string} propNames - Names of properties
	 * @returns {Boolean}
	 */
	function hasOwnProperties() {
		var output;
		var o, name;
		if (arguments.length >= 2) {
			o = arguments[0];
			for (var i = 1; i < arguments.length; i++) {
				name = arguments[i];
				if (!o.hasOwnProperty(name)) {
					output = false;
					break;
				}
			}
			if (output !== false) {
				output = true;
			}
		}
		return output;
	}

	/**
	 * This function is used for parsing epsg.io search results into objects from JSON.
	 * @param {string} k
	 * @param {*} v
	 * @returns {Object}
	 */
	var reviver = function (k, v) {
		if (v) {
			if (k === "code" && typeof v === "string" && /^\d+$/.test(v)) {
				return parseInt(v);
			} else if (hasOwnProperties(v, "accuracy", "proj4", "code",
				"name", "area", "bbox", "trans", "wkt",
				"kind", "default_trans")) {
				return new CoordinateSystem(v);
			} else if (hasOwnProperties(v, "proj4", "name", "area", "bbox", "code_trans", "wkt", "accuracy")) {
				return new Transformation(v);
			}
		}
		return v;
	};

	/**
	 * Parses JSON text into specialized objects for epsg.io results.
	 * @returns {Object}
	 */
	function parse(/**{string}*/ jsonString) {
		return JSON.parse(jsonString, reviver);
	}

	return {
		CoordinateSystem: CoordinateSystem,
		parse: parse
	};
});