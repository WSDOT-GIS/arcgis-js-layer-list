
/*global define*/
define([
	"dojo/text!./units.json"
], function (unitsJson) {

	function Unit(o) {
		this.name = o.name;
		this.value = o.value;
		this.description = o.description;
	}

	Unit.prototype.toOption = function () {
		var option = document.createElement("option");
		option.value = this.value;
		option.textContent = this.description;
		option.dataset.name = this.name;
		return option;
	}


	var units = JSON.parse(unitsJson, function (k, v) {
		if (v.hasOwnProperty("name")) {
			return new Unit(v);
		} else {
			return v;
		}
	});

	units = units.sort(function (a, b) {
		if (a.name > b.name) {
			return 1
		} else if (a.name < b.name) {
			return -1
		} else {
			return 0;
		}
	});

	function createUnitSelect(defaultName) {
		if (!defaultName) {
			defaultName = "Foot";
		}
		var frag = document.createDocumentFragment();
		function createGroup(label) {
			var group = document.createElement("optgroup");
			group.label = label;
			frag.appendChild(group);
			return group;
		}
		var metricGroup = createGroup("Metric");
		var internationalGroup = createGroup("International");
		var usSurveyGroup = createGroup("US Survey");
		var nauticalGroup = createGroup("Nautical");
		var arcGroup = createGroup("Arc");
		var clarkesGroup = createGroup("Clarke's")
		var searsGroup = createGroup("Sears");
		var indianGroup = createGroup("Indian");
		var benoitGroup = createGroup("Benoit");

		var metricRe = /met(?:(?:er)|(?:re))/i;
		var nauticalRe = /nautical/i;
		var usSurveyRe = /US\sSurvey/i;
		var internationalRe = /International/i;
		var arcRe = /\barc\b/i;
		var clarkesRe = /Clarke/i;
		var searsRe = /Sears/i;
		var indianRe = /Indian/i;
		var benoitRe = /Benoit/i;

		units.forEach(function (unit) {
			var option = unit.toOption()
			if (unit.name === defaultName) {
				option.selected = true;
			}
			if (metricRe.test(unit.description)) {
				metricGroup.appendChild(option);
			} else if (arcRe.test(unit.description)) {
				arcGroup.appendChild(option);
			} else if (clarkesRe.test(unit.description)) {
				clarkesGroup.appendChild(option);
			} else if (searsRe.test(unit.description)) {
				searsGroup.appendChild(option);
			} else if (indianRe.test(unit.description)){
				indianGroup.appendChild(option);
			} else if (benoitRe.test(unit.description)) {
				benoitGroup.appendChild(option);
			} else if (nauticalRe.test(unit.description)) {
				nauticalGroup.appendChild(option);
			} else if (usSurveyRe.test(unit.description)) {
				usSurveyGroup.appendChild(option);
			} else if (internationalRe.test(unit.description)) {
				internationalGroup.appendChild(option);
			} else {
				frag.appendChild(option);
			}
		});
		var select = document.createElement("select");
		select.appendChild(frag);
		return select;
	}

	Unit.createUnitSelect = createUnitSelect;
	Unit.units = units;

	return Unit;
});