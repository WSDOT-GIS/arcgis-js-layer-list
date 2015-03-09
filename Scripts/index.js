
/*global require*/
require([
	"esri/config",
	"esri/arcgis/utils",
	"esri/geometry/jsonUtils",
	"esri/tasks/GeometryService",
	"esri/tasks/BufferParameters",
	"buffer",
	"buffer/BufferLinkInfoWindow",
	"epsg_io",
	"dojo/text!epsg_io/WA_prj_cs.json"
], function (esriConfig, arcgisUtils, geometryJsonUtils, GeometryService, BufferParameters, BufferUI, BufferLinkInfoWindow, epsg_io, projections) {
	var buffer;

	projections = epsg_io.parse(projections);
	var geometryService = new GeometryService("http://www.wsdot.wa.gov/geosvcs/ArcGIS/rest/services/Geometry/GeometryServer");

	// Specify CORS enabled servers.
	["www.wsdot.wa.gov", "wsdot.wa.gov", "gispublic.dfw.wa.gov"].forEach(function (svr) {
		esriConfig.defaults.io.corsEnabledServers.push(svr);
	});
	// Since CORS servers are explicitly specified, CORS detection is not necessary.
	// This prevents the following types of errors from appearing in the console:
	// XMLHttpRequest cannot load http://gis.rita.dot.gov/ArcGIS/rest/info?f=json. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://example.com' is therefore not allowed access. 
	esriConfig.defaults.io.corsDetection = false;
	
	// Create the Buffer UI in the specified node.
	buffer = new BufferUI(document.getElementById("buffer"));

	buffer.addProjections(projections.results);

	// Create a map from a predefined webmap on AGOL.
	arcgisUtils.createMap("927b5daaa7f4434db4b312364489544d", "map").then(function (response) {
		var map = response.map;

		var bufferLink = BufferLinkInfoWindow.addBufferLink(map.infoWindow, buffer);

		buffer.form.addEventListener("buffer", function (e) {
			var bufferParameters = new BufferParameters();
			var detail = e.detail;

			bufferParameters.bufferSpatialReference = detail.bufferSpatialReference;
			bufferParameters.distances = detail.distances;
			bufferParameters.geodesic = detail.geodesic;
			bufferParameters.geometries = detail.geometries.map(geometryJsonUtils.fromJson);
			bufferParameters.unionResults = detail.unionResults;
			bufferParameters.unit = detail.unit;

			//for (var name in detail) {
			//	if (detail.hasOwnProperty(name)) {
			//		bufferParameters[name] = detail[name];
			//	}
			//}

			geometryService.buffer(bufferParameters).then(function (bufferResults) {
				console.log("buffer results", bufferResults);
			}, function (error) {
				console.error("buffer error", error);
			});
			console.debug("buffer event triggered", bufferParameters);
		});
	});
});