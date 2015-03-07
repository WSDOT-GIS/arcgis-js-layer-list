/*global define*/
define([], function () {

	function CoordinateSystem(/**{object}*/searchResult) {
		this.accuracy = searchResult.accuracy;
		this.proj4 = searchResult.proj4;
		this.code = searchResult.code;
		this.name = searchResult.name;
		this.area = searchResult.area;
		this.bbox = searchResult.bbox;
		this.trans = searchResult.trans;
		this.wkt = searchResult.wkt;
		this.kind = searchResult.kind;
		this.default_trans = searchResult.default_trans;
	}
});