// Filename: main.js
require([
	'jquery',
	'underscore',
	'backbone',
	'backbone.validation',
	'foundation.core',
	'router',
	'services/auth'
], function($, _, Backbone, Validation, Foundation, Router, AuthService) {
	// add a convenient "endsWith" function to String
	if (typeof String.prototype.endsWith !== 'function') {
    	String.prototype.endsWith = function(suffix) {
        	return this.indexOf(suffix, this.length - suffix.length) !== -1;
    	};
	}

	// add a close method to all Backbone views
	Backbone.View.prototype.close = function() {
		this.remove();
		this.unbind();
		if (this.onClose) {
			this.onClose();
		}
	};

	// initialize Foundation Javascript
	$(document).foundation();

	// add default form validation callbacks
	_.extend(Validation.callbacks, {
		valid: function(view, attr) {
			view.$el.find('#' + attr).removeClass('error');
			view.$el.find('#' + attr + 'Error').css('display', 'none');
		},
		invalid: function(view, attr, error, selector) {
			view.$el.find('#' + attr).addClass('error');
			var el = view.$el.find('#' + attr + 'Error');
			el.css('display', 'block');
			el.html(error);
		}
	});

	// initialize the router
	var r = new Router();
});
define();
