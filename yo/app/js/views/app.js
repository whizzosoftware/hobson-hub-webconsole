// Filename: views/app
define([
	'jquery',
	'underscore',
	'backbone',
	'bridget',
	'masonry',
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
	'models/telemetry',
	'services/hub',
	'views/navbar',
	'views/sidebar/sidebar',
	'views/dashboard/dashboard',
	'views/tasks/tasksTab',
	'views/tasks/taskCreate',
	'views/insight/insight',
	'views/insight/electric',
	'views/device/deviceState',
	'views/device/deviceSettings',
	'views/device/deviceStatistics',
	'views/settings/settingsGeneral',
	'views/settings/settingsEmail',
	'views/settings/settingsLog',
	'views/settings/settingsPlugins',
	'views/account/accountHubs',
	'views/account/accountProfile',
	'i18n!nls/strings',
	'text!templates/app.html'
], function($, _, Backbone, bridget, Masonry, Sidr, session, Hub, ItemList, Config, Plugin, Devices, Device, DeviceConfig, Task, Telemetry, HubService, HubNavbarView, SidebarView, DashboardView, TasksTabView, TaskAddView, InsightView, InsightElectricView, DeviceStateView, DeviceSettingsView, DeviceStatisticsView, HubSettingsGeneralView, HubSettingsEmailView, HubSettingsLogView, HubSettingsPluginsView, AccountHubsView, AccountProfileView, strings, appTemplate) {

	var AppView = Backbone.View.extend({

		name: 'hub',

		template: _.template(appTemplate),

		initialize: function() {
			bridget('masonry', Masonry);
		},

		render: function() {
			this.$el.append(this.template());
			this.$el.find('#sidr').sidr({
				side: 'right',
				onOpen: this.onSidebarOpen,
				onClose: this.onSidebarClose
			});
			return this;
		},

		showDashboard: function() {
			if (session.hasSelectedHub() && session.getSelectedHubDevicesUrl()) {
				var devices = new ItemList({url: session.getSelectedHubDevicesUrl() + '?expand=item,preferredVariable', model: Device, sort: 'name'});
				devices.fetch({
					context: this,
					success: function(model, response, options) {
						options.context.renderDashboard(options.context, model);
					}
				});
			} else {
				this.renderDashboard(this, null);
			}
		},

		renderDashboard: function(ctx, devices) {
			var dv = new DashboardView({
				devices: devices
			});
			ctx.renderContentView(dv, true);
			$('.dash-tiles').masonry({
				itemSelector: '.tile',
				gutter: 10
			});
		},

		showTasks: function(userId, hubId) {
			var tasks = new ItemList({model: Task, url: '/api/v1/users/local/hubs/local/tasks?expand=item'});
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
			console.debug('showTaskAdd', userId, hubId);
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
					var url = query === 'filter=available' ? hub.get('remotePlugins')['@id'] : hub.get('localPlugins')['@id'];
					var plugins = new ItemList({model: Plugin, url: url + '?expand=item'});
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
			var device = new Device({url: deviceUrl});
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
			var device = new Device({url: deviceUrl});
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
			var device = new Device({url: deviceUrl + '?expand=configurationClass,configuration'});
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
			var device = new Device({url: deviceUrl});
			device.fetch({
				context: this,
				success: function(model, response, options) {
					var telemetry = new Telemetry({
						url: model.get('telemetry').links.self
					});
					telemetry.fetch({
						context: options.context,
						success: function(model, result, options) {
							options.context.renderContentView(new DeviceStatisticsView({
								device: device,
								telemetry: model
							}));
						},
						fail: function(model, result, options) {
							console.debug('Nope!');
						}
					});
				},
				error: function(model, response, options) {
					console.debug('nope!');
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