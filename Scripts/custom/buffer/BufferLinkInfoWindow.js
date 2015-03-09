/*global define*/
define([], function () {
	/**
	 * Adds a "buffer" link to an InfoWindow.
	 * When clicked it will add the selected feature
	 * to the BufferUI geometries list.
	 * @param {esri/widget/InfoWindow} infoWindow
	 * @param {BufferUI} bufferUI
	 */
	function addBufferLink(infoWindow, bufferUI) {
		var actionList = infoWindow.domNode.querySelector(".actionList");
		var link = document.createElement("a");
		var docFrag = document.createDocumentFragment();
		link.textContent = "Buffer";
		link.href = "#";
		link.title = "Add selected geometry to Buffer UI list";
		link.classList.add("action");
		link.classList.add("buffer");
		// Add a space before adding link.
		docFrag.appendChild(document.createTextNode(" "));
		docFrag.appendChild(link);

		link.onclick = function () {
			var feature = infoWindow.features[infoWindow.selectedIndex];
			bufferUI.addFeature(feature);

			return false;
		};

		actionList.appendChild(docFrag);
		return link;
	}

	return {
		addBufferLink: addBufferLink
	};
});