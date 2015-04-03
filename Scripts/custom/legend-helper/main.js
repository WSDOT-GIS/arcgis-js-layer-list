/*global define*/
define(["./LegendResponse"], function (LegendResponse) {

	/**
	 * Gets legend info for a map service.
	 * @param {(string|esri/layers/layer)} mapServiceUrl - Either the URL of a map service or a Layer class from the ArcGIS API for JavaScript.
	 * @param {Object[]} [dynamicLayers] - Dynamic layer definitions.
	 * @returns {Promise}
	 */
	function getLegendInfo(mapServiceUrl, dynamicLayers) {
		if (dynamicLayers) {
			throw new Error("dynamicLayers support not yet implemented.");
		}
		if (typeof mapServiceUrl !== "string" && mapServiceUrl.url) {
			mapServiceUrl = mapServiceUrl.url;
		}
		var promise = new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();
			req.open("GET", mapServiceUrl.replace("/\/$", "") + "/legend?f=json");
			req.onloadend = function () {
				var response;
				if (this.status === 200) {
					response = LegendResponse.parseJson(this.responseText);
					if (response.error) {
						reject(response);
					} else {
						resolve(response);
					}
				} else {
					reject({ error: this.statusText });
				}
			};
			req.send();
		});

		return promise;
	}

	return {
		getLegendInfo: getLegendInfo
	};
});