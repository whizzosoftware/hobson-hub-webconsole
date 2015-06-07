// Filename: models/plugin.js
define([
	'backbone'
], function(Backbone) {
	var PluginModel = Backbone.Model.extend({

		initialize: function(url) {
			this.url = url;
		}

	});

	return PluginModel;
});