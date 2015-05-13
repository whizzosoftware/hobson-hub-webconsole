// Filename: views/settings/settingsPlugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/settings/settingsTab',
	'views/settings/plugins',
	'i18n!nls/strings',
	'text!templates/settings/settingsPlugins.html'
], function($, _, Backbone, SettingsTab, PluginsView, strings, template) {

	var ProfileView = SettingsTab.extend({

		tabName: 'plugins',

		template: _.template(template),

		events: {
			'pluginSettingsClick': 'onClickSettings'
		},

		initialize: function(options) {
			console.debug('settingsPlugins init');
			this.hub = options.hub;
			this.plugins = options.plugins;
			this.query = options.query;
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				hub: this.hub.toJSON(),
				query: this.query
			}));

			var type = (this.query === 'filter=available') ? 'AVAILABLE' : 'PLUGIN';

			this.pluginsView = new PluginsView(this.plugins.where({type: type}));
			this.$el.find('#pluginsContainer').html(this.pluginsView.render().el);
		},

		onClickSettings: function(event, plugin) {
			console.debug('plugin click: ', plugin);
			var model = new Config({url: plugin.get('links').configuration});
			model.fetch({
				context: this,
				success: function (model, response, options) {
					console.debug('got plugin configuration: ', model);
					var el = options.context.$el.find('#plugin-config-modal');
					el.html(new PluginSettingsView({
						plugin: plugin, 
						pluginConfig: model
					}).render().el);
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