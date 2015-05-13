// Filename: models/plugins.js
define([
	'backbone',
	'models/plugin'
], function(Backbone, PluginModel) {

	var PluginsCollection = Backbone.Collection.extend({
		model: PluginModel,

		initialize: function(url) {
			this.url = url + '?details=true';
		}
	});

	return PluginsCollection;
});