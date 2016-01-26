// Filename: views/app
define([
	'jquery',
	'underscore',
	'backbone',
	'sidr',
	'models/session',
	'models/hub',
	'models/itemList',
	'models/propertyContainer',
	'models/plugin',
	'models/devices',
	'models/device',
	'models/deviceConfig',
	'models/task',
	'services/hub',
	'views/navbar',
	'views/sidebar/sidebar',
	'views/dashboard/dashboard',
	'views/tasks/tasksTab',
	'views/tasks/taskCreate',
	'views/device/deviceState',
	'views/device/deviceSettings',
	'views/data/dataTab',
	'views/data/dataViewer',
	'views/settings/settingsGeneral',
	'views/settings/settingsPassports',
	'views/settings/settingsEmail',
	'views/settings/settingsPresence',
	'views/settings/settingsLog',
	'views/settings/settingsPlugins',
	'views/account/accountHubs',
	'views/account/accountProfile',
	'i18n!nls/strings',
	'text!templates/app.html'
], function($, _, Backbone, Sidr, session, Hub, ItemList, Config, Plugin, Devices, Device, DeviceConfig, Task, HubService, HubNavbarView, SidebarView, DashboardView, TasksTabView, TaskAddView, DeviceStateView, DeviceSettingsView, DataTabView, DataViewer, HubSettingsGeneralView, HubSettingsAdvancedView, HubSettingsEmailView, HubSettingsPresenceView, HubSettingsLogView, HubSettingsPluginsView, AccountHubsView, AccountProfileView, strings, appTemplate) {

	var AppView = Backbone.View.extend({

		name: 'hub',

		template: _.template(appTemplate),

		render: function() {
			this.$el.append(this.template());

			if (session.showActivityLog()) {
				this.$el.find('#sidr').sidr({
					side: 'right',
					onOpen: this.onSidebarOpen,
					onClose: this.onSidebarClose
				});
			}
			
			return this;
		},

		showDashboard: function() {
			this.renderContentView(new DashboardView());
		},

		showData: function() {
			this.renderContentView(new DataTabView());
		},

		showDataViewer: function(dataStreamId, inr) {
			this.renderContentView(new DataViewer({dataStreamId: dataStreamId, inr: inr}));
		},

		showTasks: function(userId, hubId) {
			var tasks = new ItemList(null, {model: Task, url: '/api/v1/users/local/hubs/local/tasks?expand=item', sort: 'name'});
			tasks.fetch({
				context: this,
				success: function(model, response, options) {
					options.context.renderContentView(new TasksTabView({
						userId: userId,
						hubId: hubId,
						tasks: model
					}));
				},
				error: function(model, response, options) {
					console.debug('nope!');
				}
			});
		},

		showTaskAdd: function(userId, hubId) {
			this.renderContentView(new TaskAddView({
				userId: userId, 
				hubId: hubId
			}), true);
		},

		showInsight: function() {
			this.renderContentView(new InsightView(), true);
		},

		showInsightElectric: function() {
			this.renderContentView(new InsightElectricView(), true);
		},

		showHubSettingsGeneral: function() {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var config = new Config({url: model.get('configuration')['@id']});
					config.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.renderContentView(new HubSettingsGeneralView({
								model: model
							}));
						},
						error: function(model, response, options) {
							console.debug('nope');
						}
					});
				}
			});
		},

		showHubSettingsPassports: function() {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var config = new Config({url: model.get('configuration')['@id']});
					config.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.renderContentView(new HubSettingsAdvancedView({
								model: model
							}));
						},
						error: function(model, response, options) {
							console.debug('nope');
						}
					});
				}
			});
		},

		showHubSettingsEmail: function(userId, hubId) {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var config = new Config({url: model.get('configuration')['@id']});
					config.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.renderContentView(new HubSettingsEmailView({
								model: model
							}));
						},
						error: function(model, response, options) {
							console.debug('nope');
						}
					});
				}
			});
		},

		showHubSettingsPresence: function(userId, hubId) {
			this.renderContentView(new HubSettingsPresenceView());
		},

		showHubSettingsLog: function() {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var hub = model;
					var config = new Config({url: hub.get('configuration')['@id']});
					config.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.renderContentView(new HubSettingsLogView({
								model: model,
								hub: hub
							}));
						},
						error: function(model, response, options) {
							console.debug('nope');
						}
					});
				}
			});
		},

		showHubSettingsPlugins: function(query) {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var hub = model;
					var url = (query === 'filter=available') ? hub.get('remotePlugins')['@id'] : hub.get('localPlugins')['@id'];
					var plugins = new ItemList(null, {model: Plugin, url: url + '?expand=item'});
					plugins.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.renderContentView(new HubSettingsPluginsView({
								hub: hub,
								model: model,
								query: query
							}));
						},
						error: function(model, response, options) {
						}
					});
				}
			});
		},

		showCloudlinkHubs: function() {
			this.renderContentView(new AccountHubsView());
		},

		showCloudlinkProfile: function() {
			this.renderContentView(new AccountProfileView());
		},

		showDeviceDetails: function(deviceUrl) {
			var device = new Device({url: deviceUrl + '?expand=telemetry'});
			device.fetch({
				context: this,
				success: function(model, response, options) {
					options.context.renderContentView(new DeviceDetailsView({model: model}));
				},
				error: function(model, response, options) {
					console.debug('nope!');
				}
			});
		},

		showDeviceState: function(deviceUrl) {
			var device = new Device({url: deviceUrl + '?expand=variables.item,telemetry'});
			device.fetch({
				context: this,
				success: function(model, response, options) {
					options.context.renderContentView(new DeviceStateView({model: model}));
				},
				error: function(model, response, options) {
					console.debug('nope!');
				}
			});
		},

		showDeviceSettings: function(deviceUrl) {
			// retrieve the device info with full configuration information
			var device = new Device({url: deviceUrl + '?expand=cclass,configuration,telemetry'});
			device.fetch({
				context: this,
				success: function(model, response, options) {
					options.context.renderContentView(new DeviceSettingsView({model: model}));
				},
				error: function(model, response, options) {
					console.debug('nope!');
				}
			});
		},

		showDeviceStatistics: function(deviceUrl) {
			var device = new Device({url: deviceUrl + '?expand=telemetry'});
			device.fetch({
				context: this,
				success: function(model, response, options) {
					var device = model;
					var datasets = new ItemList(null, {model: TelemetryDataset, url: model.get('telemetry').datasets['@id'] + '?expand=item'});
					datasets.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.renderContentView(new DeviceStatisticsView({
								model: device,
								datasets: model,
							}));
						},
						error: function(model, response, options) {
						}
					})
				},
				fail: function(model, result, options) {
					console.debug('Nope!');
				}
			});
		},

		renderContentView: function(view) {
			if (!this.navbarView) {
				this.navbarView = new HubNavbarView({
					user: this.user, 
					hub: this.hub
				});
				this.$el.find('#navbar-container').html(this.navbarView.render().el);
			} else {
				this.navbarView.updateTabs();
			}

			if (this.contentView) {
				this.contentView.remove();
			}
			this.contentView = view;
			this.$el.find('#content-container').append(view.render().el);
		},

		onSidebarOpen: function() {
			this.sidebarView = new SidebarView();
			$('#sidr').html(this.sidebarView.render().el);
		},

		onSidebarClose: function() {
			var context = this;
			setTimeout(function() {
				context.sidebarView.remove()
				context.sidebarView = null;
			}, 200);
		}
	});

	return AppView;
});