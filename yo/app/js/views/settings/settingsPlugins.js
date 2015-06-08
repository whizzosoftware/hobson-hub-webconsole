// Filename: views/settings/settingsPlugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/plugin',
	'models/propertyContainer',
	'views/settings/settingsTab',
	'views/settings/plugins',
	'views/settings/pluginSettings',
	'i18n!nls/strings',
	'text!templates/settings/settingsPlugins.html'
], function($, _, Backbone, toastr, ItemList, Plugin, Config, SettingsTab, PluginsView, PluginSettingsView, strings, template) {

	return SettingsTab.extend({

		tabName: 'plugins',

		template: _.template(template),

		events: {
			'pluginSettingsClick': 'onClickSettings'
		},

		refreshInterval: null,

		initialize: function(options) {
			this.hub = options.hub;
			this.query = options.query;
		},

		remove: function() {
			if (this.refreshInterval) {
				clearInterval(this.refreshInterval);
				this.refreshInterval = null;
			}
			this.pluginsView.remove();
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				hub: this.hub.toJSON(),
				query: this.query
			}));

			var type = (this.query === 'filter=available') ? 'AVAILABLE' : 'PLUGIN';

			this.pluginsView = new PluginsView({model: this.model.where({type: type})});
			this.$el.find('#pluginsContainer').html(this.pluginsView.render().el);

			if (!this.refreshInterval && type === 'PLUGIN') {
				this.refreshInterval = setInterval(function() {
					this.refresh();
				}.bind(this), 5000);
			}
		},

		refresh: function() {
			var plugins = new ItemList({model: Plugin, url: this.model.url});
			plugins.fetch({
				context: this,
				success: function(model, response, options) {
					options.context.pluginsView.reRender(model);
				}
			});
		},

		onClickSettings: function(event, plugin) {
			var config = new Config({url: plugin.get('@id') + '?expand=configurationClass,configuration'});
			config.fetch({
				context: this,
				success: function (model, response, options) {
					var el = options.context.$el.find('#plugin-config-modal');
					el.html(new PluginSettingsView({model: plugin}).render().el);
					el.foundation('reveal', 'open');
				},
				error: function() {
					toastr.error(strings.PluginConfigurationError);
				}
			});
		}

	});

});