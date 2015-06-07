// Filename: views/settings/settingsPlugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/propertyContainer',
	'views/settings/settingsTab',
	'views/settings/plugins',
	'views/settings/pluginSettings',
	'i18n!nls/strings',
	'text!templates/settings/settingsPlugins.html'
], function($, _, Backbone, Config, SettingsTab, PluginsView, PluginSettingsView, strings, template) {

	var ProfileView = SettingsTab.extend({

		tabName: 'plugins',

		template: _.template(template),

		events: {
			'pluginSettingsClick': 'onClickSettings'
		},

		initialize: function(options) {
			this.hub = options.hub;
			this.query = options.query;
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
		},

		onClickSettings: function(event, plugin) {
			console.debug('plugin click: ', plugin);
			var config = new Config({url: plugin.get('@id') + '?expand=configurationClass,configuration'});
			config.fetch({
				context: this,
				success: function (model, response, options) {
					console.debug('got plugin configuration: ', model);
					var el = options.context.$el.find('#plugin-config-modal');
					el.html(new PluginSettingsView({model: plugin}).render().el);
					el.foundation('reveal', 'open');
				},
				error: function() {
					console.log('nope!');
				}
			});
		}		

	});

	return ProfileView;
});