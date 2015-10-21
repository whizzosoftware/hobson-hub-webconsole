// Filename: services/hub.js
define([
	'jquery',
	'models/session',
	'models/hubs',
	'models/hub'
], function($, session, Hubs, Hub) {
	return {
		betaRepositoryUrl: 'file:///Users/dan/Desktop/repository.xml',

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

		sendTestEmail: function(ctx, userId, hubId, model) {
			var url = '/api/v1/users/' + userId + '/hubs/' + hubId + '/configuration/sendTestEmail';
			var data = model.toJSON();
			console.debug('POSTing to URL with data: ', url, data);
			return $.ajax(url, {
				context: ctx,
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
				type: 'POST',
				timeout: 5000
			});
		},

		enableBetaPlugins: function(ctx, userId, hubId) {
			var url = '/api/v1/users/' + userId + '/hubs/' + hubId + '/repositories';

			var req = {
				uri: this.betaRepositoryUrl
			};

			return $.ajax(url, {
				context: ctx,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(req),
				dataType: 'json'
			});
		},

		disableBetaPlugins: function(ctx, userId, hubId) {
			var url = '/api/v1/users/' + userId + '/hubs/' + hubId + '/repositories/' + encodeURIComponent(this.betaRepositoryUrl);
			return $.ajax(url, {
				context: ctx,
				type: 'DELETE'
			});
		},

		shutdown: function(ctx, url) {
			return $.ajax(url, {
				context: ctx,
				type: 'POST'
			});
		}

	};
});