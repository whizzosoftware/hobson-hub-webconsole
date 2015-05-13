// Filename: models/config.js
define([
	'backbone'
], function(Backbone) {
	var ConfigModel = Backbone.Model.extend({

		defaults: {
			properties: {}
		},

		initialize: function(options) {
			this.url = options.url;
		},

		setProperty: function(key, value) {
			this.get('properties')[key] = {
				value: value
			}
		}

	});

	return ConfigModel;
});