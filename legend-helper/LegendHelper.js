define(["./LegendResponse"], function (LegendResponse) {
    /**
     * @module LegendHelper
     */

    return {
        /**
         * Gets legend info for a map service.
         * @param {(string|esri/layers/layer)} mapServiceUrl - Either the URL of a map service or a Layer class from the ArcGIS API for JavaScript.
         * @param {Object[]} [dynamicLayers] - Dynamic layer definitions.
         * @returns {Promise}
         */
        getLegendInfo: function (mapServiceUrl, dynamicLayers) {
            if (dynamicLayers) {
                throw new Error("dynamicLayers support not yet implemented.");
            }
            if (typeof mapServiceUrl !== "string" && mapServiceUrl.url) {
                mapServiceUrl = mapServiceUrl.url;
            }
            var featureLayerUrlRe = /\/\d+\/?$/;
            var promise = new Promise(function (resolve, reject) {
                if (mapServiceUrl) {
                    var req = new XMLHttpRequest();
                    if (featureLayerUrlRe.test(mapServiceUrl)) {
                        req.open("GET", mapServiceUrl + "?f=json");
                        req.onloadend = function () {
                            var response;
                            if (this.status === 200) {
                                response = JSON.parse(this.responseText);
                                if (response.error) {
                                    reject(response.error);
                                } else {
                                    resolve(response.drawingInfo);
                                }
                            } else {
                                reject({ error: this.statusText || this.status });
                            }
                        };
                        req.send();
                    } else {
                        req.open("GET", mapServiceUrl.replace("/\/$", "") + "/legend?f=json");
                        req.onloadend = function () {
                            var response;
                            if (this.status === 200) {
                                response = LegendResponse.parseJson(this.responseText);
                                if (response.error) {
                                    reject(response.error);
                                } else {
                                    resolve(response);
                                }
                            } else {
                                reject({ error: this.statusText || this.status });
                            }
                        };
                        req.send();
                    }
                } else {
                    reject({ error: "No URL provided." });
                }
            });

            return promise;
        }
    };
});