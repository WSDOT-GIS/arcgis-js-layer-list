/*global define*/
define(function () {
	"use strict";

	/**
	 * 
	 * @external Portal
	 * @see https://developers.arcgis.com/javascript/jsapi/portal-amd.html
	 */

	/**
	 * Details about the result of an ArcGIS Portal query.
	 * @external PortalQueryResult
	 * @see https://developers.arcgis.com/javascript/jsapi/portalqueryresult-amd.html
	 */

	/**
	 * 
	 * @typedef {Object} QueryParams
	 * @property {number} num
	 * @property {string} q
	 * @property {string} sortField
	 * @property {number] start
	 */


	/**
	 * A UI for browsing Portal contents.
	 * @param {external:Portal} portal
	 * @class
	 */
	function PortalBrowser(portal, domNode) {

		function createEvent(result) {
			var event = new CustomEvent("item-add", {
				detail: result
			});

			domNode.dispatchEvent(event);
		}

		/**
		 * Creates a list item representing a portal query result.
		 * @param {object} result
		 * @returns {HTMLLIElement}
		 */
		function createResultListItem(result) {
			var li = document.createElement("li");
			li.dataset.id = result.id;
			li.dataset.itemUrl = result.itemUrl;
			li.dataset.itemDataUrl = result.itemDataUrl;

			var detailsUrl = "http://www.arcgis.com/home/item.html?id=" + result.id;

			var thumbnail, addButton, div;

			var icon = document.createElement("img");
			icon.src = result.iconUrl;
			icon.width = icon.height = 16;


			addButton = document.createElement("button");
			addButton.type = "button";
			addButton.textContent = "+";
			addButton.title = "Add";

			addButton.addEventListener("click", function () {
				createEvent(result);
			});

			div = document.createElement("div");
			div.appendChild(addButton);

			li.appendChild(div);

			div = document.createElement("div");

			if (result.thumbnailUrl) {
				thumbnail = document.createElement("img");
				thumbnail.src = result.thumbnailUrl;
				thumbnail.classList.add("thumbnail");

				div.appendChild(thumbnail);
			}

			li.appendChild(div);

			div = document.createElement("div");
			div.appendChild(icon);
			div.appendChild(document.createTextNode(result.title));

			var p = document.createElement("p");

			var infoLink = document.createElement("a");
			infoLink.textContent = "info…";
			infoLink.href = detailsUrl;
			infoLink.target = "_blank";

			p.appendChild(infoLink);

			div.appendChild(p);

			li.appendChild(div);

			return li;
		}

		if (!portal) {
			throw new TypeError("portal parameter not provided.");
		} else if (!domNode) {
			throw new TypeError("domNode parameter not provided.");
		}

		this.root = domNode;
		domNode.classList.add("portal-browser");

		var form = document.createElement("form");

		var searchBox = document.createElement("input");
		searchBox.type = "search";
		searchBox.disabled = true;
		searchBox.setAttribute("value", '(group:"2485b37bd67d45bf8a1e56c6216eeb7a") AND (typekeywords: "Service")');
		this.searchBox = searchBox;

		var submitButton = document.createElement("button");
		submitButton.type = "submit";
		var searchIcon = document.createElement("span");
		searchIcon.setAttribute("class", "search icon");
		submitButton.appendChild(searchIcon);
		var labelSpan = document.createElement("span");
		labelSpan.classList.add("label");
		labelSpan.textContent = "Search";
		submitButton.appendChild(labelSpan);


		form.appendChild(searchBox);
		form.appendChild(submitButton);

		form.onsubmit = function () {
			return false;
		};

		domNode.appendChild(form);


		this.portal = portal;

		

		var list = document.createElement("ul");
		this.list = list;



		list.classList.add("portal-item-list");
		domNode.appendChild(list);

		var progress = document.createElement("progress");
		domNode.appendChild(progress);


		var moreButton = document.createElement("button");
		moreButton.type = "button";
		moreButton.textContent = "More";

		moreButton.classList.add("more-button");

		moreButton.addEventListener("click", function () {
			var queryParams = JSON.parse(moreButton.dataset.nextQueryParams);
			domNode.classList.add("busy");
			portal.queryItems(queryParams).then(handleQueryResults);
		});

		domNode.appendChild(moreButton);

		/**
		 * Adds portal items to the list.
		 * Sets the "nextQueryParams" dataset item in the "More" button.
		 * @param {external:PortalQueryResult} result
		 */
		function handleQueryResults(result) {
			var frag = document.createDocumentFragment();
			result.results.forEach(function (item) {
				console.log(item);
				var li = createResultListItem(item);
				frag.appendChild(li);
			});
			list.appendChild(frag);
			domNode.classList.remove("busy");

			moreButton.dataset.nextQueryParams = result.nextQueryParams.start > -1 ? JSON.stringify(result.nextQueryParams) : "";
		}

		domNode.classList.add("busy");
		portal.queryItems({
			q: this.searchBox.value
		}).then(handleQueryResults);
	}

	return PortalBrowser;
});