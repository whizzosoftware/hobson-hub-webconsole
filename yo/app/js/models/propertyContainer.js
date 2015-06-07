// Filename: models/propertyContainer.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({

		defaults: {
			values: {}
		},

		initialize: function(options) {
			this.url = options.url;
		},

		setProperty: function(key, value) {
			this.get('values')[key] = value;
		}

	});
});