// <nowiki>

var config = {};

$.when(
	// Resource loader module
	mw.loader.using( [ 'mediawiki.util', 'mediawiki.api' ] ),
	// Page ready
	$.ready
).then( function() {

	// MediaWiki configuration 
	config.mw = mw.config.get( [
		"wgPageName",
		"wgNamespaceNumber",
	]);

	var API = new mw.Api({
		ajax: {
			headers: {
				"Api-User-Agent": "userPageBlanking"
			}
		}
	});

	// Setup
	var isUserPage = config.mw.wgNamespaceNumber === 2 || config.mw.wgNamespaceNumber === 3;
	if (isUserPage) {
		mw.util.addPortletLink('p-cactions', "#", 'BlankPage', 'ca-blankUPage', "Blank User page", null, "#ca-move");
		$('#ca-blankUPage').on('click', function() {
			console.log("About to blank " + config.mw.wgPageName);
			blankUserPage(config.mw.wgPageName)
				.then(function() { window.location.reload(); });
		});
		return;
	}

	function blankUserPage(userPage) {
		let editSummary = prompt("Reason for blanking page","Blanked, See [[WP:UPNOT]]");
		if (editSummary == null || editSummary == "") {
			console.log("Not blanking the page");
			return Promise.resolve();
		}
		var queryParams = {
			action: "edit",
			text: "",
			summary: editSummary + "using [[User:DreamRimmer/BlankUserPage|BlankUserPage 1.0]]",
			nocreate: true,
			title: userPage
		};
		return API.postWithToken("csrf", queryParams);
	}
});
// </nowiki>
