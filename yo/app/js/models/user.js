// Filename: models/user.js
define([
	'backbone'
], function(Backbone) {
	var UserModel = Backbone.Model.extend({
		getHubsUrl: function() {
			return this.get('links').hubs;
		}
	});

	return UserModel;
});