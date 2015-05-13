// Filename: services/hub.js
define([
	'jquery',
	'models/session',
	'models/hubs',
	'models/hub'
], function($, session, Hubs, Hub) {
	var HubService = {

		retrieveHubWithId: function(hubId, hubsUrl, callback) {
			var hub = session.getSelectedHub();
			console.debug('selected hub: ', hub);
			if (hub.get('id') !== hubId) {
				console.debug('hub is different');
				var hubs = new Hubs(hubsUrl);
				hubs.fetch({
					context: this,
					success: function(model, response, options) {
						// see if the requested hub is in the user's hub list
						var h = null;
						for (var i=0; i < model.length; i++) {
							if (model.at(i).get('id') === hubId) {
								h = new Hub(model.at(i).toJSON());
								break;
							}
						}

						// if it is, fetch its details
						if (h != null) {
							console.debug('retrieving hub: ', h, callback);
							h.fetch(callback);
						} else {
							console.debug('no hub found with id: ', hubId);
						}
					},
					error: function(model, response, options) {
						console.debug('error getting hub list');
					}
				});
			} else {
				console.debug('hub is the same', hub);
				hub.fetch(callback);
			}
		},

		sendTestEmail: function(userId, hubId, model) {
			var url = '/api/v1/users/' + userId + '/hubs/' + hubId + '/configuration/sendTestEmail';
			var data = model.toJSON();
			console.debug('POSTing to URL with data: ', url, data);
			return $.ajax(url, {
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(data),
				dataType: 'json'
			});
		},

		setPassword: function(ctx, userId, hubId, password) {
			var url = '/api/v1/users/' + userId + '/hubs/' + hubId + '/password';
			var data = {currentPassword: 'local', newPassword: password};
			console.debug('POSTing to URL with data: ', url, data);
			return $.ajax(url, {
				context: ctx,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(data),
				dataType: 'json'
			});
		},

		installPlugin: function(ctx, url) {
			return $.ajax(url, {
				type: 'POST'
			});
			console.debug('installing plugin: ', url);
		}

	};

	return HubService;
});