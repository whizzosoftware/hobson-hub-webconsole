// Filename: models/session.js
define([
	'backbone',
	'models/user',
	'models/hub'
], function(Backbone, User, Hub) {
	var Session = Backbone.Model.extend({

		initialize: function() {
			console.debug('Created user session');

			var userJson = window.sessionStorage.getItem('user');
			if (userJson) {
				console.debug('Read user from session storage', userJson);
				this.set('user', new User(JSON.parse(userJson)));
			}

			var hubJson = window.sessionStorage.getItem('hub');
			if (hubJson) {
				this.set('hub', new Hub(JSON.parse(hubJson)));
				console.debug('Read hub from session storage', this.get('hub'));
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

		getHubsUrl: function() {
			console.debug(this.getUser());
			return (this.hasUser()) ? this.getUser().get('hubs')['@id'] : null;
		},

		hasSelectedHub: function() {
			return (this.get('hub'));
		},

		setSelectedHub: function(hub) {
			console.debug('setSelectedHub: ', hub);
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
			console.debug(this.getSelectedHub());
			return this.getSelectedHub().get('devices')["@id"];
		}

	});

	return new Session();
});