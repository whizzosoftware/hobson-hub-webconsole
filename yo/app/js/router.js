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
			'settings/email': 'showHubSettingsEmail',
			'settings/log': 'showHubSettingsLog',
			'settings/plugins': 'showHubSettingsPlugins',
			'settings/plugins?queryString': 'showHubSettingsPlugins',

			// other
			':userId': 'routeToDefaultHub'
		},

		initialize: function() {
			console.debug('router init');
			Backbone.history.start();
		},

		showLoginApp: function() {
			this.renderAppRoot('login');
		},

		showAccount: function() {
			Backbone.history.navigate('account/hubs', {trigger: true});
		},

		showCloudlinkHubs: function() {
			console.debug('router.showCloudlinkHubs');
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
			console.debug('showDeviceDetails: ', deviceUrl);
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

		showHubSettingsEmail: function() {
			this.renderAppRoot('hub');
			this.appView.showHubSettingsEmail();
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

		renderAppRoot: function(name, options) {
			// if the app view has changed...
			if (!this.appView || this.appView.name !== name) {
				// remove the old app root view if present
				if (this.appView) {
					console.debug('removing old app view: ', this.appView.name);
					this.appView.remove();
					this.appView = null;
				}

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
					console.debug('new app view created: ', this.appView.name);
					$('body').append(this.appView.render().el);
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
			console.debug('routeToDefaultHub', session);
			var hubs = new Hubs(session.getHubsUrl() + '?expand=links');
			console.debug('fetching hubs collection');
			hubs.fetch().then(function() {
				console.debug('hubs collection fetched');
				if (hubs.length > 0) {
					var hub = hubs.at(0);
					session.setSelectedHub(hub);
					Backbone.history.navigate('#dashboard', {trigger: true});
				} else {
					console.debug('no hubs found; redirecting to account app');
					Backbone.history.navigate('#account/hubs', {trigger: true});
				}
			});
		}

	});

	return AppRouter;
});