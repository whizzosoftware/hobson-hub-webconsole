// Filename: services/hub.js
define([
	'jquery',
	'models/session',
	'models/hubs',
	'models/hub'
], function($, session, Hubs, Hub) {
	return {
		retrieveHubWithId: function(hubId, hubsUrl, callback) {
			var hub = session.getSelectedHub();
			if (hub.get('id') !== hubId) {
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
		},

		enableBetaPlugins: function(ctx, userId, hubId, enabled) {
			var url = '/api/v1/users/' + userId + '/hubs/' + hubId + '/enableRemoteRepository';

			var req = {
				url: 'file:///Users/dan/Desktop/repository.xml',
				enabled: enabled
			};

			return $.ajax(url, {
				context: ctx,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(req),
				dataType: 'json'
			});
		}

	};
});