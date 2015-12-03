/*global define*/
define(["esri/request"], function (esriRequest) {
	"use strict";

	var layerUrlRe = /([\w\d\/\:%\.]+\/MapServer)(?:\/(\d*))?\/?$/i; // Match results: [full url, map server url, layer id]

	/**
	 * Examines a layer (or a layer URL) and returns the map service url and layer id parts as properties in the returned object.
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object. 
	 * @returns {Object} An object with the properties mapServerUrl and layerId.  mapServerUrl is the url to the map server (without any layerIDs).  layerId is the layer ID portion of the URL.  If the URL did not contain a layerID, this property will have a value of null.
	 */
	function getMapServerUrl(layer) {
		var url, match, output;
		if (layer) {
			if (typeof layer === "string") {
				url = layer;
			} else if (typeof layer.url === "string") {
				url = layer.url;
			} else {
				throw new TypeError("The layer parameter must be either a string or a Layer.");
			}
		} else {
			throw new TypeError("The layer parameter must be either a string or an esri.layers.Layer.");
		}

		match = url.match(layerUrlRe);

		if (match) {
			output = {
				mapServerUrl: match[1],
				layerId: match.length >= 3 && match[2] ? Number(match[2]) : null
			};
			if (isNaN(output.layerId)) {
				output.layerId = null;
			} else {
				return output;
			}
		} else {
			throw new Error("Invalid layer URL format.");
		}
	}

	/**
 * Given an esri.layers.Layer object or a layer URL, returns the URL for a query to the Layer Metadata SOE root page. 
 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object.
 * @returns {String} The URL to the SOE root. 
 */
	function getMetadataSoeRootUrl(layer) {
		var output, url = getMapServerUrl(layer); // This will throw an Error if it fails.
		output = url.mapServerUrl + "/exts/LayerMetadata";
		return output;
	}



	/**
	 * Given an esri.layers.Layer object or a layer URL, returns the URL for a query to the Layer Metadata SOE for a list of valid layer IDs. 
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object.
	 * @returns {String} The URL to a query for a list of valid layers. 
	 */
	function getValidLayersUrl(layer) {
		var url = getMapServerUrl(layer); // This will throw an Error if it fails.
		return url.mapServerUrl + "/exts/LayerMetadata/validLayers";
	}



	/**
	 * Returns the Layer Metadata SOE URL to retrieve the metadata for a map service feature layer.
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object.
	 * @param {Number} [sublayerId] If the URL provided via the layer parameter does not contain a layer ID, this parameter must be used to supply one.  If the URL already has a layer ID, this parameter will be ignored.
	 * @returns {String} The URL for the layer's metadata.
	 */
	function getMetadataUrl(layer, sublayerId) {
		var urlInfo = getMapServerUrl(layer), output;
		if (urlInfo.layerId !== null) {
			sublayerId = urlInfo.layerId;
		}
		if (typeof sublayerId !== "number") {
			throw new Error("Invalid layer id.  Layer id must be an integer.");
		}
		output = urlInfo.mapServerUrl + "/exts/LayerMetadata/metadata/" + String(sublayerId);

		return output;
	}

	function getLayerInfoWithMatchingId(layerInfos, id) {
		var layerInfo, current;
		for (var i = 0, l = layerInfos.length; i < l; i += 1) {
			current = layerInfos[i];
			if (current.id === id) {
				layerInfo = current;
				break;
			}
		}
		return layerInfo;
	}



	/**
	 * Calls the SOE to get the list of layer IDs that correspond to feature layers. 
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object.
	 * @returns {Promise} Returns a Promise. The resolve function takes parameter "data" which is an array of integers. The reject function takes an "error" parameter of type Error.
	 */
	function getIdsOfLayersWithMetadata(layer) {
		var promise = new Promise(function (resolve, reject) {
			try {
				return esriRequest({
					url: getValidLayersUrl(layer),
					callbackParamName: "callback",
					content: {
						"f": "json"
					}
				}, {
					useProxy: false
				}).then(function (data) {
					var output, metadataRootUrl = getMetadataSoeRootUrl(layer);
					if (data.error) {
						reject(data.error);
					}
					else {
						// In the ArcGIS 10.0 version, an array was returned.
						// In the ArcGIS 10.1 version, an object is returned.  
						// This object has a property called layerIds which is an array. 
						if (!(data instanceof Array)) {
							data = data.layerIds;
						}

						if (metadataRootUrl && layer.layerInfos) {
							output = {};
							data.forEach(function (id) {
								var metadataUrl = [metadataRootUrl, "metadata", id].join("/");
								var layerInfo = getLayerInfoWithMatchingId(layer.layerInfos, id);
								var layerName = layerInfo.name;
								output[layerName] = metadataUrl;
							});
						}

						if (!output) {
							output = data;
						}

						console.debug(output);

						resolve(output);
					}
				}, function (error) {
					reject(error);
				});
			} catch (err) {
				reject(err);
			}
		});

		return promise;

	}



	function supportsMetadata(layer) {
		var promise = new Promise(function (resolve, reject) {
			try {
				esriRequest({
					url: getMetadataSoeRootUrl(layer),
					callbackParamName: "callback",
					content: {
						"f": "json"
					}
				}, {
					useProxy: false
				}).then(function (data) {
					if (data.error) {
						resolve(false);
					}
					else {
						resolve(true);
					}
				}, function (error) {
					reject(error);
				});
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

	var exports = {
		getMapServerUrl: getMapServerUrl,
		getMetadataSoeRootUrl: getMetadataSoeRootUrl,
		getValidLayersUrl: getValidLayersUrl,
		getMetadataUrl: getMetadataUrl,

		getIdsOfLayersWithMetadata: getIdsOfLayersWithMetadata,
		supportsMetadata: supportsMetadata
	};


	return exports;
});