// Filename: services/user.js
define([
	'jquery',
	'models/session',
	'models/itemList',
  'models/user',
	'models/dataStream'
], function($, session, ItemList, User, DataStream) {
	return {
    getAuthenticatedUser: function(ctx, success, error) {
      var user = new User({url: '/api/v1/userInfo?expand=hubs'});
      user.fetch({
        context: ctx,
        success: function(model, response, options) {
          success(ctx, model);
        },
        error: function(model, response, options) {
          error(ctx, 'Error retrieving authenticated user info');
        }
      })
    },

		getDataStreams: function(ctx, success, error) {
			var user = session.getUser();
			if (user.get('dataStreams')) {
				var dataStreams = new ItemList(
					null,
					{url: user.get('dataStreams')['@id'] + '?expand=item', model: DataStream}
				);
				dataStreams.fetch({
					context: ctx,
					success: function(model, response, options) {
						success(ctx, model);
					},
					error: function(model, response, options) {
						error('Error getting data stream list');
					}
				});
			}
		},

		getDataStream: function(ctx, url, success, error) {
			var dataStream = new DataStream({url: url});
			dataStream.fetch({
				context: ctx,
				success: function(model, response, options) {
					success(ctx, model);
				},
				error: function(model, response, options) {
					error('Error getting data stream');
				}
			})
		},

		getDataStreamData: function(ctx, url, inr, success, error) {
			if (inr) {
				url += '?inr=' + inr;
			}
			var dataStream = new DataStream({url: url});
			dataStream.fetch({
				context: ctx,
				success: function(model, response, options) {
					success(ctx, model);
				},
				error: function(model, response, options) {
					error('Error getting data stream');
				}
			})
		},

		addDataStream: function(ctx, data, success, error) {
			var user = session.getUser();
			if (user.get('dataStreams')) {
				var dataStream = new DataStream({url: user.get('dataStreams')['@id']});
				dataStream.set('name', data.name);
				dataStream.set('variables', data.variables);
				dataStream.save(null, {
					success: success,
					error: error
				});
			} else {
				error('Creating data streams is not supported');
			}
		}

	};
});
