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
	'services/action',
	'views/settings/settingsTab',
	'views/settings/plugins',
	'views/settings/pluginSettings',
	'views/action/actionExecutionDialog',
	'i18n!nls/strings',
	'text!templates/settings/settingsPlugins.html'
], function($, _, Backbone, toastr, session, ItemList, Plugin, Config, Repository, HubService, ActionService, SettingsTab, PluginsView, PluginSettingsView, ActionExecutionDialogView, strings, template) {

	return SettingsTab.extend({

		tabName: 'plugins',

		template: _.template(template),

		events: {
			'pluginSettingsClick': 'onClickSettings',
			'pluginInstallClick': 'onClickInstall',
			'pluginUpdateClick': 'onClickUpdate',
			'pluginActionClick': 'onClickAction',
			'click #betaCheckbox': 'onClickBeta'
		},

		initialize: function(options) {
			this.hub = options.hub;
			this.query = options.query;
			this.showLocal = (this.query !== 'filter=available');
		},

		remove: function() {
			if (this.actionExecutionDialog) {
				this.actionExecutionDialog.remove();
			}
			this.pluginsView.remove();
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var hub = model;
					var url = (options.context.query === 'filter=available') ? hub.get('remotePlugins')['@id'] : hub.get('localPlugins')['@id'];
					HubService.getPlugins(options.context, url, function(model, response, options) {
						options.context.model = model;

						// render the core view
						el.html(options.context.template({
							strings: strings,
							hub: hub.toJSON(),
							local: options.context.showLocal,
							query: options.context.query
						}));

						var filteredModel;

						// if we're showing local plugins, filter the model based on the 'PLUGIN' type
						if (options.context.showLocal) {
							filteredModel = model.filteredList('type', 'PLUGIN');
						// otherwise, just display all plugins
						} else {
							filteredModel = model;
						}

						// disable the beta checkbox while we retrieve its state
						var checkbox = el.find('#betaCheckbox');
						checkbox.attr('disabled', true);
						HubService.getRepositories(options.context, function(ctx, model) {
							checkbox.attr('checked', model.numberOfItems > 1);
							checkbox.attr('disabled', false);
						}, function(ctx, model) {
							toastr.error(strings.ErrorOccurred);
						});

						// create the plugins view
						options.context.pluginsView = new PluginsView({
							model: filteredModel,
							showLocal: options.context.showLocal
						});
						el.find('#pluginsContainer').html(options.context.pluginsView.render().el);
					}, function(model, response, options) {
						toastr.error(strings.ErrorOccurred);
					});
				},
				error: function(model, response, options) {
					toastr.error(strings.ErrorOccurred);
					console.debug(response);
				}
			});
		},

		refresh: function() {
		  HubService.getPlugins(this, this.model.url, function(model, response, options) {
        options.context.pluginsView.reRender(model.where({type: 'PLUGIN'}));
      });
		},

		checkForUpdates: function() {
			var hub = session.getSelectedHub();
			var url = hub.get('remotePlugins')['@id'];
			var plugins = new ItemList(null, {model: Plugin, url: url + '?expand=item'});
			plugins.fetch({
				context: this,
				success: function(model, response, options) {
					// build a map of plugin ID to version
					var updateMap = {};
					for (var ix in model.models) {
						var p = model.models[ix];
						updateMap[p.get('pluginId')] = {
							version: p.get('version'),
							install: p.get('links') ? p.get('links').install : null
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
					console.debug(response);
				}
			});
		},

		onClickSettings: function(event, plugin) {
			var config = new Config({url: plugin.get('@id') + '?expand=cclass,configuration'});
			config.fetch({
				context: this,
				success: function (model, response, options) {
					var el = options.context.$el.find('#plugin-config-modal');
					el.html(new PluginSettingsView({model: model}).render().el);
					el.foundation('reveal', 'open');
				},
				error: function() {
					toastr.error(strings.PluginConfigurationError);
					console.debug(response);
				}
			});
		},

		onClickInstall: function(event, plugin) {
			HubService.installPlugin(this, plugin.get('links')['install'])
				.success(function(data, status, response) {
					toastr.info(strings.PluginInstallStarted);
				})
				.fail(function(response, status, error) {
					toastr.error(strings.PluginInstallFailed);
					console.debug(response);
				});
		},

		onClickUpdate: function(event, plugin) {
			HubService.installPlugin(this, plugin.get('links')['update'])
				.success(function(data, status, response) {
					toastr.info(strings.PluginInstallStarted);
				})
				.fail(function(response, status, error) {
					toastr.error(strings.PluginInstallFailed);
					console.debug(response);
				});
		},

		onClickAction: function(event, actionClassId) {
				ActionService.getActionClass(actionClassId, function(model, response, options) {
					var el = this.$el.find('#plugin-config-modal');
					if (this.actionExecutionDialog != null) {
						this.actionExecutionDialog.remove();
					}
					this.actionExecutionDialog = new ActionExecutionDialogView({model: model});
					el.html(this.actionExecutionDialog.render().el);
					el.foundation('reveal', 'open');
				}.bind(this), function(model, response, options) {
					toastr.error(strings.ErrorOccurred);
					console.debug('error', response);
				}.bind(this));
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
