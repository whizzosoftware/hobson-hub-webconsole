// Filename: models/propertyContainer.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({

		initialize: function(options) {
			this.url = options.url;
			this.set('values', {});
		},

		setProperty: function(key, value) {
			this.get('values')[key] = value;
		}

	});
});