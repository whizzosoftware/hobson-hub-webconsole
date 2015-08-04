// Filename: views/settings/settingsPlugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'models/itemList',
	'models/plugin',
	'models/propertyContainer',
	'models/repository',
	'services/hub',
	'views/settings/settingsTab',
	'views/settings/plugins',
	'views/settings/pluginSettings',
	'i18n!nls/strings',
	'text!templates/settings/settingsPlugins.html'
], function($, _, Backbone, toastr, session, ItemList, Plugin, Config, Repository, HubService, SettingsTab, PluginsView, PluginSettingsView, strings, template) {

	return SettingsTab.extend({

		tabName: 'plugins',

		template: _.template(template),

		events: {
			'pluginSettingsClick': 'onClickSettings',
			'pluginInstallClick': 'onClickInstall',
			'pluginUpdateClick': 'onClickUpdate',
			'click #betaCheckbox': 'onClickBeta'
		},

		initialize: function(options) {
			this.hub = options.hub;
			this.query = options.query;
			this.refereshInterval = null;
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

			// render the core view
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

			// disable the beta checkbox while we retrieve its state
			var checkbox = this.$el.find('#betaCheckbox');
			checkbox.attr('disabled', true);
			var items = new ItemList({model: Repository, url: '/api/v1/users/local/hubs/local/repositories'});
			items.fetch({
				context: this,
				success: function(model, response, options) {
					checkbox.attr('checked', model.models.length > 1);
					checkbox.attr('disabled', false);
				}
			});

			// create the plugins view
			this.pluginsView = new PluginsView({
				model: filteredModel
			});
			this.$el.find('#pluginsContainer').html(this.pluginsView.render().el);

			// if local plugins are being shown, create a refresh timer and check for any remote updates
			if (showLocal) {
				if (!this.refreshInterval) {
					this.refreshInterval = setInterval(function() {
						this.refresh();
					}.bind(this), 5000);
				}

				this.checkForUpdates();
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

		checkForUpdates: function() {
			var hub = session.getSelectedHub();
			var url = hub.get('remotePlugins')['@id'];
			var plugins = new ItemList({model: Plugin, url: url + '?expand=item'});
			plugins.fetch({
				context: this,
				success: function(model, response, options) {
					// build a map of plugin ID to version
					var updateMap = {};
					for (var ix in model.models) {
						var p = model.models[ix];
						updateMap[p.get('pluginId')] = {
							version: p.get('version'),
							install: p.get('links').install
						};
					}

					// flag any local plugins as having updates
					for (var ix=0; ix < options.context.model.length; ix++) {
						var p = options.context.model.at(ix);
						var u = updateMap[p.get('pluginId')];
						if (u) {
							p.set('updateLink', u.install);
						}
					}
				},
				error: function(model, response, options) {
					toastr.error(strings.PluginUpdateCheckError);
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
			HubService.installPlugin(this, plugin.get('links').install)
				.success(function(data, status, response) {
					toastr.info(strings.PluginInstallStarted);
				})
				.fail(function(response, status, error) {
					toastr.error(strings.PluginInstallFailed);
				});
		},

		onClickUpdate: function(event, plugin) {
			HubService.installPlugin(this, plugin.get('updateLink'))
				.success(function(data, status, response) {
					toastr.info(strings.PluginInstallStarted);
				})
				.fail(function(response, status, error) {
					toastr.error(strings.PluginInstallFailed);
				});
			},

		onClickBeta: function(event) {
			var checkbox = event.currentTarget;
			var enabled = event.currentTarget.checked;

			checkbox.disabled = true;

			if (!enabled) {
				HubService.disableBetaPlugins(this, 'local', 'local').
					success(function(response) {
						checkbox.disabled = false;
						toastr.success(strings.BetaPluginSettingUpdated);
						this.refresh();
					}).
					fail(function(response) {
						checkbox.disabled = false;
						toastr.error(strings.BetaPluginSettingFailed);
					}
				);
			} else {
				HubService.enableBetaPlugins(this, 'local', 'local').
	                fail(function(response) {
	                	checkbox.disabled = false;
	                    if (response.status === 202) {
	                        toastr.success(strings.BetaPluginSettingUpdated);
	                        this.refresh();
	                    } else {
	                        toastr.error(strings.BetaPluginSettingFailed);
	                    }
	                }
	            );            	
	        }
		}

	});

});