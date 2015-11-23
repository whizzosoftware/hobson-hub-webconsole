// Filename: models/session.js
define([
	'backbone',
	'models/user',
	'models/hub'
], function(Backbone, User, Hub) {
	var Session = Backbone.Model.extend({

		initialize: function() {
			var userJson = window.sessionStorage.getItem('user');
			if (userJson) {
				this.set('user', new User(JSON.parse(userJson)));
			}

			var hubJson = window.sessionStorage.getItem('hub');
			if (hubJson) {
				this.set('hub', new Hub(JSON.parse(hubJson)));
			}
		},

		hasUser: function() {
			return this.get('user');
		},

		setUser: function(user) {
			window.sessionStorage.setItem('user', JSON.stringify(user.toJSON()));
			this.set('user', user);
		},

		getUser: function() {
			return this.get('user');
		},

		getUserAccount: function() {
			var u = this.getUser();
			if (u) {
				return u.get('account');
			}
			return null;
		},

		getHubsUrl: function() {
			return (this.hasUser()) ? this.getUser().get('hubs')['@id'] : null;
		},

		hasSelectedHub: function() {
			return (this.get('hub'));
		},

		setSelectedHub: function(hub) {
			window.sessionStorage.setItem('hub', JSON.stringify(hub.toJSON()));
			this.set('hub', hub);
		},

		getSelectedHub: function() {
			return this.get('hub');
		},

		getSelectedHubUrl: function() {
			return this.getSelectedHub().get('links').self;
		},

		getSelectedHubDevicesUrl: function() {
			return this.getSelectedHub().get('devices')['@id'];
		},

		showAccount: function() {
			return this.getUserAccount();
		},

		showActivityLog: function() {
			var hub = this.getSelectedHub();
			return (hub && hub.get('links') && hub.get('links').activityLog);
		},

		showPowerOff: function() {
			var hub = this.getSelectedHub();
			return (hub && hub.get('links') && hub.get('links').powerOff);
		}

	});

	return new Session();
});