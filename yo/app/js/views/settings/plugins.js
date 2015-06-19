// Filename: views/plugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/settings/plugin',
	'i18n!nls/strings'
], function($, _, Backbone, PluginView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: 'plugins small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		subviews: {},

		noPluginsPrompt: false,

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			var p;
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					this.addPluginView(this.model.at(i));
				}
			} else {
				this.$el.html('<p class="notice">' + strings.NoPluginsInstalled + '</p>');
				noPluginsPrompt = true;
			}

			return this;
		},

		reRender: function(plugins) {
			if (plugins.length > 0) {
				if (this.noPluginsPrompt) {
					this.$el.html('');
					this.noPluginsPrompt = false;
				}
				for (var ix=0; ix < plugins.length; ix++) {
					var plugin = plugins[ix];
					var view = this.subviews[plugin.get('@id')];
					if (view) {
						view.reRender(plugin);
					} else {
						this.addPluginView(plugin);
					}
				}
			}
		},

		addPluginView: function(plugin) {
			var pluginView = new PluginView({model: plugin});
			this.subviews[plugin.get('@id')] = pluginView;
			this.$el.append(pluginView.render().el);
		}

	});

});