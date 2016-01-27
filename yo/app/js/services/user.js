// Filename: services/user.js
define([
	'jquery',
	'models/session',
	'models/itemList',
	'models/dataStream'
], function($, session, ItemList, DataStream) {
	return {

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
		}

	};
});