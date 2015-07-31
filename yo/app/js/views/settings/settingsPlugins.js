// Filename: views/settings/settingsPlugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/plugin',
	'models/propertyContainer',
	'services/hub',
	'views/settings/settingsTab',
	'views/settings/plugins',
	'views/settings/pluginSettings',
	'i18n!nls/strings',
	'text!templates/settings/settingsPlugins.html'
], function($, _, Backbone, toastr, ItemList, Plugin, Config, HubService, SettingsTab, PluginsView, PluginSettingsView, strings, template) {

	return SettingsTab.extend({

		tabName: 'plugins',

		template: _.template(template),

		events: {
			'pluginSettingsClick': 'onClickSettings',
			'pluginInstallClick': 'onClickInstall',
			'click #betaCheckbox': 'onClickBeta'
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
			var showLocal = (this.query !== 'filter=available');

			el.html(this.template({
				strings: strings,
				hub: this.hub.toJSON(),
				local: showLocal,
				query: this.query
			}));

			var filteredModel;

			// if we're showing local plugins, filter the model based on the 'PLUGIN' type
			if (showLocal) {
				filteredModel = this.model.filteredList('type', 'PLUGIN');
			// otherwise, just display all plugins
			} else {
				filteredModel = this.model;
			}

			this.pluginsView = new PluginsView({
				model: filteredModel
			});
			this.$el.find('#pluginsContainer').html(this.pluginsView.render().el);

			if (!this.refreshInterval && showLocal) {
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
					options.context.pluginsView.reRender(model.where({type: 'PLUGIN'}));
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
		},

		onClickInstall: function(event, plugin) {
			$.ajax(plugin.get('links').install, {
				context: this,
				type: 'POST',
				timeout: 5000,
				success: function(data, status, response) {
					toastr.info(strings.PluginInstallStarted);
				},
				error: function(response, status, error) {
					toastr.error(strings.PluginInstallFailed);
				}
			});
		},

		onClickBeta: function(event) {
			var checkbox = event.currentTarget;
			var enabled = event.currentTarget.checked;

			checkbox.disabled = true;

			HubService.enableBetaPlugins(this, 'local', 'local', enabled).
                fail(function(response) {
                	checkbox.enabled = true;
                    if (response.status === 202) {
                        toastr.success(strings.TestMessageSuccessful);
                        this.refresh();
                    } else {
                        toastr.error(strings.TestMessageFailure);
                    }
                }
            );            	
		}

	});

});