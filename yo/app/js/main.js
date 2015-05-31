// Filename: main.js
require([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'router',
	'authFailHandler'
], function($, _, Backbone, Marionette, Router, authFailHandler) {
	// make sure all 401 responses route to the login page
	$.ajaxSetup({
		statusCode: {
			401: authFailHandler
		}
	});

	// $(document).foundation();

	// initialize the router
	new Router();
});
define();