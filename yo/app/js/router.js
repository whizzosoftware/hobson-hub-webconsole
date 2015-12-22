// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'models/hubs',
	'models/devices',
	'models/hub',
	'views/login/app',
	'views/app'
], function($, _, Backbone, session, Hubs, Devices, Hub, LoginAppView, HubAppView) {

	var AppRouter = Backbone.Router.extend({

		routes: {
			// login app
			'': 'showLoginApp',
			'login': 'showLoginApp',

			// account app
			'account': 'showAccount',
			'account/hubs': 'showCloudlinkHubs',
			'account/hubs/add': 'showAccountAddHub',
			'account/profile': 'showCloudlinkProfile',

			// hub app
			'hub': 'showHubRoot',
			'dashboard': 'showDashboard',
			'tasks': 'showTasks',
			'tasks/add': 'showTaskAdd',
			'insight': 'showInsight',
			'insight/electric': 'showInsightElectric',
			'device/:deviceUrl': 'showDeviceDetails',
			'device/:deviceUrl/state': 'showDeviceState',
			'device/:deviceUrl/settings': 'showDeviceSettings',
			'device/:deviceUrl/statistics': 'showDeviceStatistics',
			'settings': 'showHubSettings',
			'settings/general': 'showHubSettingsGeneral',
			'settings/passports': 'showHubSettingsPassports',
			'settings/email': 'showHubSettingsEmail',
			'settings/presence': 'showHubSettingsPresence',
			'settings/log': 'showHubSettingsLog',
			'settings/plugins': 'showHubSettingsPlugins',
			'settings/plugins?queryString': 'showHubSettingsPlugins',

			// other
			':userId': 'routeToDefaultHub'
		},

		initialize: function() {
			Backbone.history.start();
		},

		showLoginApp: function() {
			this.renderAppRoot('login');
		},

		showAccount: function() {
			Backbone.history.navigate('account/hubs', {trigger: true});
		},

		showCloudlinkHubs: function() {
			if (this.verifyValidUser()) {
				this.renderAppRoot('hub', {
					user: session.getUser()
				});
				this.appView.showCloudlinkHubs();
			}
		},

		showCloudlinkProfile: function() {
			if (this.verifyValidUser()) {
				this.renderAppRoot('hub', {
					user: session.getUser()
				});
				this.appView.showCloudlinkProfile();
			}
		},

		showHubRoot: function() {
			Backbone.history.navigate('dashboard', {trigger: true});
		},

		showDashboard: function() {
			this.renderAppRoot('hub', {});
			this.appView.showDashboard();
		},

		showTasks: function() {
			this.renderAppRoot('hub');
			this.appView.showTasks();
		},

		showTaskAdd: function() {
			this.renderAppRoot('hub');
			this.appView.showTaskAdd();
		},

		showInsight: function() {
			this.renderAppRoot('hub');
			this.appView.showInsight();
		},

		showInsightElectric: function() {
			this.renderAppRoot('hub');
			this.appView.showInsightElectric();
		},

		showDeviceDetails: function(deviceUrl) {
			this.renderAppRoot('hub');
			this.appView.showDeviceDetails(deviceUrl);
		},

		showDeviceState: function(deviceUrl) {
			this.renderAppRoot('hub');
			this.appView.showDeviceState(deviceUrl);
		},

		showDeviceSettings: function(deviceUrl) {
			this.renderAppRoot('hub');
			this.appView.showDeviceSettings(deviceUrl);
		},

		showDeviceStatistics: function(deviceUrl) {
			this.renderAppRoot('hub');
			this.appView.showDeviceStatistics(deviceUrl);
		},

		showHubSettings: function() {
			Backbone.history.navigate('settings/general', {trigger: true});
		},

		showHubSettingsGeneral: function() {
			this.renderAppRoot('hub');
			this.appView.showHubSettingsGeneral();
		},

		showHubSettingsPassports: function() {
			this.renderAppRoot('hub');
			this.appView.showHubSettingsPassports();
		},

		showHubSettingsEmail: function() {
			this.renderAppRoot('hub');
			this.appView.showHubSettingsEmail();
		},

		showHubSettingsPresence: function() {
			this.renderAppRoot('hub');
			this.appView.showHubSettingsPresence();
		},

		showHubSettingsLog: function() {
			this.renderAppRoot('hub');
			this.appView.showHubSettingsLog();
		},

		showHubSettingsPlugins: function(query) {
			this.renderAppRoot('hub');
			this.appView.showHubSettingsPlugins(query);
		},

		getContext: function() {
			var s = Backbone.history.getFragment().split('/');
			return { userId: s[0], hubId: s[1] };
		},

		removeAppView: function() {
			if (this.appView) {
				this.appView.remove();
				this.appView = null;
			}
		},

		renderAppRoot: function(name, options) {
			if (this.verifyValidUser() || name === 'login') {
				// if the app view has changed...
				if (!this.appView || this.appView.name !== name) {
					// remove the old app root view if present
					this.removeAppView();

					// set the new app root view
					switch (name) {
						case 'login':
							this.appView = new LoginAppView();
							break;
						case 'hub':
							this.appView = new HubAppView(options);
							break;
					}

					// render the new app root view
					if (this.appView) {
						$('body').append(this.appView.render().el);
					}
				}
			}
		},

		verifyValidUser: function() {
			if (session.hasUser()) {
				return true;
			} else {
				Backbone.history.navigate('/login', {trigger: true});
				return false;
			}
		},

		routeToDefaultHub: function() {
			var hubs = new Hubs(session.getHubsUrl() + '?expand=links');
			hubs.fetch().then(function() {
				if (hubs.length > 0) {
					console.debug(hubs.at(0));
					console.debug(hubs.at(0).get('itemListElement'));
					console.debug(hubs.at(0).get('itemListElement')[0]);
					var h = hubs.at(0).get('itemListElement')[0].item;
					var hub = new Hub({url: h["@id"]});
					hub.fetch({
						success: function() {
							session.setSelectedHub(hub);
							Backbone.history.navigate('#dashboard', {trigger: true});
						},
						error: function() {

						}
					});
				} else {
					Backbone.history.navigate('#account/hubs', {trigger: true});
				}
			});
		}

	});

	return AppRouter;
});