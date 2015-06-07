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

	// add a convenient "endsWith" function to String
	if (typeof String.prototype.endsWith !== 'function') {
    	String.prototype.endsWith = function(suffix) {
        	return this.indexOf(suffix, this.length - suffix.length) !== -1;
    	};
	}

	// initialize Foundation Javascript
	$(document).foundation();

	// initialize the router
	new Router();
});
define();