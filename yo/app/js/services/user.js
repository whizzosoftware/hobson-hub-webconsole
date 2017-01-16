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
    }
	};
});
