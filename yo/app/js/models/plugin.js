// Filename: models/plugin.js
define([
	'backbone'
], function(Backbone) {
	var PluginModel = Backbone.Model.extend({

		defaults: {
			description: ''
		},

		initialize: function(url) {
			this.url = url;
		}

	});

	return PluginModel;
});