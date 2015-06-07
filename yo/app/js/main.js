// Filename: main.js
require([
	'jquery',
	'underscore',
	'backbone',
	'foundation.core',
	'router',
	'authFailHandler'
], function($, _, Backbone, Foundation, Router, authFailHandler) {
	// make sure all 401 responses route to the login page
	$.ajaxSetup({
		statusCode: {
			401: authFailHandler
		}
	});

	$(document).foundation();

	// initialize the router
	new Router();
});
define();