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
	'views/tasks/taskEdit',
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
], function($, _, Backbone, Sidr, session, Hub, ItemList, Config, Plugin, Devices, Device, DeviceConfig, Task, HubService, HubNavbarView, SidebarView, DashboardView, TasksTabView, TaskEditView, DeviceStateView, DeviceSettingsView, DataTabView, DataViewer, HubSettingsGeneralView, HubSettingsAdvancedView, HubSettingsEmailView, HubSettingsPresenceView, HubSettingsLogView, HubSettingsPluginsView, AccountHubsView, AccountProfileView, strings, appTemplate) {

	var AppView = Backbone.View.extend({

		name: 'hub',

		template: _.template(appTemplate),

		initialize: function() {
			$(document).find('#loading').remove();
		},

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
			this.renderContentView(new TasksTabView({userId: userId, hubId: hubId}));
		},

		showTaskEdit: function(id) {
			this.renderContentView(new TaskEditView({id: id}), true);
		},

		showHubSettingsGeneral: function() {
			this.renderContentView(new HubSettingsGeneralView(), true);
		},

		showHubSettingsPassports: function() {
			this.renderContentView(new HubSettingsAdvancedView(), true);
		},

		showHubSettingsEmail: function(userId, hubId) {
			this.renderContentView(new HubSettingsEmailView(), true);
		},

		showHubSettingsPresence: function(userId, hubId) {
			this.renderContentView(new HubSettingsPresenceView());
		},

		showHubSettingsLog: function() {
			this.renderContentView(new HubSettingsLogView());
		},

		showHubSettingsPlugins: function(query) {
			this.renderContentView(new HubSettingsPluginsView({query: query}), true);
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