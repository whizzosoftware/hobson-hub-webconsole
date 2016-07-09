// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'cookies',
  'services/user',
  'services/hub',
  'services/auth',
  'services/url',
	'models/session',
	'models/hubs',
	'models/devices',
	'models/hub',
	'models/user',
	'views/app'
], function($, _, Backbone, Cookies, UserService, HubService, AuthService, UrlService, session, Hubs, Devices, Hub, User, HubAppView) {

	return Backbone.Router.extend({

		routes: {
			'': 'showRoot',

			// account app
			'account': 'showAccount',
			'account/hubs': 'showCloudlinkHubs',
			'account/hubs/add': 'showAccountAddHub',
			'account/profile': 'showCloudlinkProfile',

			// hub app
			'hub': 'showHubRoot',
			'dashboard': 'showDashboard',
			'dashboard2': 'showDashboard2',
			'data': 'showData',
			'data/edit': 'showDataEdit',
			'data/:dataStreamId/view': 'showDataViewer',
			'data/:dataStreamId/view?inr=:inr': 'showDataViewer',
			'tasks': 'showTasks',
			'tasks/edit': 'showTaskEdit',
			'tasks/edit?id=:id': 'showTaskEdit',
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
			'settings/plugins?queryString': 'showHubSettingsPlugins'
		},

		appView: new HubAppView(),

		initialize: function(options) {
			$('body').append(this.appView.render().el);

      // make sure all 401 responses route to the login page
      AuthService.setAuthFailHandler(true, AuthService);

      Backbone.history.start();

      // determine if any OIDC parameter are being passed in
      var l = Backbone.history.location.href;
      var accessToken = UrlService.extractAccessToken(l);
      var code = UrlService.extractCode(l);
      // if it's an access token (implicit flow) then use it
      if (accessToken) {
        var uri = UrlService.removeAccessToken(l);
        this.processAccessToken(this, accessToken, uri);
        // if it's a code (authorization code flow), try to exchange for a token
      } else if (code) {
        var uri = UrlService.removeCode(l);
        AuthService.setAuthFailHandler(false);
        $.ajax('/token', {
          context: this,
          method: 'POST',
          data: {
            code: code,
            redirect_uri: (l ? encodeURIComponent(UrlService.removeCode(l)) : null)
          },
          success: function(data, status, xhr) {
            AuthService.setAuthFailHandler(true);
            this.processAccessToken(this, data.access_token, uri);
          },
          error: function(xhr, status, error) {
            console.debug('error:', error);
          }
        });
      }
		},

    execute: function(callback, args, name) {
      if (!UrlService.hasAccessTokenOrCode(Backbone.history.location.href)) {
        if (session.hasUser()) {
          callback.apply(this, args);
        } else {
          AuthService.redirectToLogin();
        }
      }

      return false;
    },

		showRoot: function() {
      this.redirectToHub('#dashboard');
		},

		showAccount: function() {
			Backbone.history.navigate('account/hubs', {trigger: true});
		},

		showCloudlinkHubs: function() {
      this.appView.showCloudlinkHubs();
		},

		showCloudlinkProfile: function() {
      this.appView.showCloudlinkProfile();
		},

		showDashboard: function() {
      this.appView.showDashboard();
		},

		showDashboard2: function() {
      this.appView.showDashboard2();
		},

		showDataEdit: function(id) {
      var s = id ? decodeURIComponent(id.replace('id=', '')) : null;
      this.appView.showDataEdit(s);
		},

		showHubRoot: function() {
			Backbone.history.navigate('dashboard', {trigger: true});
		},

		showTasks: function() {
      this.appView.showTasks();
		},

		showTaskEdit: function(id) {
      var s = id ? decodeURIComponent(id.replace('id=', '')) : null;
      this.appView.showTaskEdit(s);
		},

		showData: function() {
      this.appView.showData();
		},

		showDataViewer: function(dataStreamId, inr) {
      var s = inr ? inr.replace('inr=', '') : null;
      this.appView.showDataViewer(dataStreamId, s);
		},

		showDeviceDetails: function(deviceUrl) {
      this.appView.showDeviceDetails(deviceUrl);
		},

		showDeviceState: function(deviceUrl) {
      this.appView.showDeviceState(deviceUrl);
		},

		showDeviceSettings: function(deviceUrl) {
      this.appView.showDeviceSettings(deviceUrl);
		},

		showDeviceStatistics: function(deviceUrl) {
      this.appView.showDeviceStatistics(deviceUrl);
		},

		showHubSettings: function() {
			Backbone.history.navigate('settings/general', {trigger: true});
		},

		showHubSettingsGeneral: function() {
      this.appView.showHubSettingsGeneral();
		},

		showHubSettingsPassports: function() {
      this.appView.showHubSettingsPassports();
		},

		showHubSettingsEmail: function() {
      this.appView.showHubSettingsEmail();
		},

		showHubSettingsPresence: function() {
      this.appView.showHubSettingsPresence();
		},

		showHubSettingsLog: function() {
      this.appView.showHubSettingsLog();
		},

		showHubSettingsPlugins: function(query) {
      this.appView.showHubSettingsPlugins(query);
		},

		getContext: function() {
			var s = Backbone.history.getFragment().split('/');
			return { userId: s[0], hubId: s[1] };
		},

    processAccessToken: function(ctx, accessToken, redirectUri) {
      // set a cookie for token
      // note that it's a secure cookie if the user is not local
      if (accessToken) {
        Cookies.set('Token', accessToken, {secure: false});
      }

      UserService.getAuthenticatedUser(this, function(ctx, user) {
        // set the user information in the session
        session.setUser(user);
        // determine what to do next
        ctx.redirectToHub(redirectUri);
      }, function(ctx, error) {
        // NO-OP - handled by the authFailHandler
      });
    },

    redirectToHub: function(redirectUri) {
      var user = session.getUser();
      var hubs = user.get('hubs');
      if (hubs && hubs.itemListElement && hubs.itemListElement.length > 0) {
        var h = hubs.itemListElement[0].item;
        HubService.getHubWithId(this, h["@id"], function(hub, response, options) {
            console.debug('Setting selected hub: ', hub);
            session.setSelectedHub(hub);
            if (!redirectUri) {
              redirectUri = '#dashboard';
            }
            window.location.href = redirectUri;
          }, function(error, response, options) {
            console.debug('Error retrieving hub data: ', error);
          }
        );
      } else {
        Backbone.history.navigate('#account/hubs', {trigger: true});
      }
    }

	});

});