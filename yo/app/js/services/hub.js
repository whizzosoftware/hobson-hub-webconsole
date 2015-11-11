// Filename: services/hub.js
define([
	'jquery',
	'models/session',
	'models/hubs',
	'models/hub',
	'models/itemList',
	'models/dashboardData',
	'models/presenceEntity',
	'models/presenceLocation',
	'models/activityLogEntry',
], function($, session, Hubs, Hub, ItemList, DashboardData, PresenceEntity, PresenceLocation, ActivityLogEntry) {
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

		getDashboardData: function(ctx, headers, success, error) {
			var hub = session.getSelectedHub();
			var url = '/api/v1/users/local/hubs/local?expand=devices.item.preferredVariable,presenceEntities.item.location';
			if (hub && url) {
				var items = new DashboardData({url: url});
				items.fetch({
					context: ctx,
					headers: headers,
					success: success,
					error: error
				});
			} else {
				error(null, null, {context: ctx});
			}
		},

		getActivityLog: function(ctx, success, error) {
			var hub = session.getSelectedHub();
			if (hub) {
				var url = hub.get('links') ? hub.get('links').activityLog : null;
				if (url) {
					this.activities = new ItemList(null, {model: ActivityLogEntry, url: url});
					this.activities.fetch({
						context: ctx,
						success: success,
						error: error
					});
					return;
				}
			}
			success(null, null, {context: ctx});
		},

		getLocations: function(ctx, success, error) {
			var hub = session.getSelectedHub();
			if (hub) {
				var url = '/api/v1/users/local/hubs/local/presence/locations?expand=item';
				if (url) {
					var locations = new ItemList(null, {model: PresenceLocation, url: url, sort: 'name'});
					locations.fetch({
						context: ctx,
						success: success,
						error: error
					});
					return;
				}
			}
			success(null, null, {context: ctx});
		},

		createNewPresenceLocation: function() {
			var hub = session.getSelectedHub();
			var url = '/api/v1/users/local/hubs/local/presence/locations';
			if (hub && url) {
				return new PresenceLocation({url: url});
			} else {
				return null;
			}
		},

		createPresenceEntitiesModel: function() {
			var hub = session.getSelectedHub();
			var url = '/api/v1/users/local/hubs/local/presence/entities?expand=item';
			if (hub && url) {
				return new ItemList(null, {model: PresenceEntity, url: url, sort: 'name'});
			} else {
				return null;
			}
		},

		getPresenceEntities: function(ctx, success, error) {
			var hub = session.getSelectedHub();
			if (hub) {
				var url = '/api/v1/users/local/hubs/local/presence/entities?expand=item';
				if (url) {
					var entities = new ItemList(null, {model: PresenceEntity, url: url, sort: 'name'});
					entities.fetch({
						context: ctx,
						success: success,
						error: error
					});
					return;
				}
			}
			success(null, null, {context: ctx});
		},

		createNewPresenceEntity: function() {
			var hub = session.getSelectedHub();
			var url = '/api/v1/users/local/hubs/local/presence/entities';
			if (hub && url) {
				return new PresenceEntity({url: url});
			} else {
				return null;
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