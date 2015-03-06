
/*global define*/
define(function () {

	// Define the available units. See https://developers.arcgis.com/javascript/jsapi/bufferparameters-amd.html#unit
	var units = [
		{ "name": "Meter", "value": 9001, "description": "International meter" },
		{ "name": "GermanMeter", "value": 9031, "description": "German legal meter" },
		{ "name": "Foot", "value": 9002, "description": "International foot" },
		{ "name": "SurveyFoot", "value": 9003, "description": "US survey foot" },
		{ "name": "ClarkeFoot", "value": 9005, "description": "Clarke's foot" },
		{ "name": "Fathom", "value": 9014, "description": "Fathom" },
		{ "name": "NauticalMile", "value": 9030, "description": "International nautical mile" },
		{ "name": "SurveyChain", "value": 9033, "description": "US survey chain" },
		{ "name": "SurveyLink", "value": 9034, "description": "US survey link" },
		{ "name": "SurveyMile", "value": 9035, "description": "US survey mile" },
		{ "name": "Kilometer", "value": 9036, "description": "Kilometer" },
		{ "name": "ClarkeYard", "value": 9037, "description": "Yard (Clarke's ratio)" },
		{ "name": "ClarkeChain", "value": 9038, "description": "Chain (Clarke's ratio)" },
		{ "name": "ClarkeLink", "value": 9039, "description": "Link (Clarke's ratio)" },
		{ "name": "SearsYard", "value": 9040, "description": "Yard (Sears)" },
		{ "name": "SearsFoot", "value": 9041, "description": "Sears' foot" },
		{ "name": "SearsChain", "value": 9042, "description": "Chain (Sears)" },
		{ "name": "SearsLink", "value": 9043, "description": "Link (Sears)" },
		{ "name": "Benoit1895A_Yard", "value": 9050, "description": "Yard (Benoit 1895 A)" },
		{ "name": "Benoit1895A_Foot", "value": 9051, "description": "Foot (Benoit 1895 A)" },
		{ "name": "Benoit1895A_Chain", "value": 9052, "description": "Chain (Benoit 1895 A)" },
		{ "name": "Benoit1895A_Link", "value": 9053, "description": "Link (Benoit 1895 A)" },
		{ "name": "Benoit1895B_Yard", "value": 9060, "description": "Yard (Benoit 1895 B)" },
		{ "name": "Benoit1895B_Foot", "value": 9061, "description": "Foot (Benoit 1895 B)" },
		{ "name": "Benoit1895B_Chain", "value": 9062, "description": "Chain (Benoit 1895 B)" },
		{ "name": "Benoit1895B_Link", "value": 9063, "description": "Link (Benoit 1895 B)" },
		{ "name": "IndianFoot", "value": 9080, "description": "Indian geodetic foot" },
		{ "name": "Indian1937Foot", "value": 9081, "description": "Indian foot (1937)" },
		{ "name": "Indian1962Foot", "value": 9082, "description": "Indian foot (1962)" },
		{ "name": "Indian1975Foot", "value": 9083, "description": "Indian foot (1975)" },
		{ "name": "IndianYard", "value": 9084, "description": "Indian yard" },
		{ "name": "Indian1937Yard", "value": 9085, "description": "Indian yard (1937)" },
		{ "name": "Indian1962Yard", "value": 9086, "description": "Indian yard (1962)" },
		{ "name": "Indian1975Yard", "value": 9087, "description": "Indian yard (1975)" },
		{ "name": "Foot1865", "value": 9070, "description": "Foot (1865)" },
		{ "name": "Radian", "value": 9101, "description": "Radian" },
		{ "name": "Degree", "value": 9102, "description": "Degree" },
		{ "name": "ArcMinute", "value": 9103, "description": "Arc-minute" },
		{ "name": "ArcSecond", "value": 9104, "description": "Arc-second" },
		{ "name": "Grad", "value": 9105, "description": "Grad" },
		{ "name": "Gon", "value": 9106, "description": "Gon" },
		{ "name": "Microradian", "value": 9109, "description": "Microradian" },
		{ "name": "ArcMinuteCentesimal", "value": 9112, "description": "Centesimal arc-minute" },
		{ "name": "ArcSecondCentesimal", "value": 9113, "description": "Centesimal arc-second" },
		{ "name": "Mil6400", "value": 9114, "description": "Mil" },
		{ "name": "British1936Foot", "value": 9095, "description": "British Foot (1936)" },
		{ "name": "GoldCoastFoot", "value": 9094, "description": "Gold Coast Foot" },
		{ "name": "InternationalChain", "value": 9097, "description": "International Chain" },
		{ "name": "InternationalLink", "value": 9098, "description": "International Link" },
		{ "name": "InternationalYard", "value": 9096, "description": "International Yard" },
		{ "name": "StatuteMile", "value": 9093, "description": "Statute Mile" },
		{ "name": "SurveyYard", "value": 109002, "description": "US survey Yard" },
		{ "name": "50KilometerLength", "value": 109030, "description": "50 Kilometer Length" },
		{ "name": "150KilometerLength", "value": 109031, "description": "150 Kilometer Length" },
		{ "name": "Decimeter", "value": 109005, "description": "Decimeter" },
		{ "name": "Centimeter", "value": 109006, "description": "Centimeter" },
		{ "name": "Millimeter", "value": 109007, "description": "Millimeter" },
		{ "name": "InternationalInch", "value": 109008, "description": "International inch" },
		{ "name": "USsurveyInch", "value": 109009, "description": "US survey inch" },
		{ "name": "InternationalRod", "value": 109010, "description": "International rod" },
		{ "name": "USsurveyRod", "value": 109011, "description": "US survey rod" },
		{ "name": "USNauticalMile", "value": 109012, "description": "US nautical mile (pre-1954)" },
		{ "name": "UKNauticalMile", "value": 109013, "description": "UK nautical mile (pre-1970)" }
	];

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

	// Convert to Unit objects.
	units = units.map(function (u) {
		return new Unit(u);
	});

	// Sort by name.
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