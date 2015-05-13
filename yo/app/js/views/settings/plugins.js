// Filename: views/plugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/settings/plugin',
	'i18n!nls/strings'
], function($, _, Backbone, PluginView, strings) {

	var PluginsView = Backbone.View.extend({
		subviews: [],

		tagName: 'ul',

		className: 'plugins small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		initialize: function(plugins) {
			console.debug(plugins);
			this.plugins = plugins;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			var p;
			for (var i = 0; i < this.plugins.length; i++) {
				var pluginView = new PluginView(this.plugins[i]);
				var rv = pluginView.render().el;
				this.$el.append(rv);
				this.subviews.push(pluginView);
			}

			return this;
		}

	});

	return PluginsView;
});