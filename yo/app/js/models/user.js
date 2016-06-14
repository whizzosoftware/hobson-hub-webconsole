// Filename: models/user.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({
    initialize: function(options) {
      if (options && options.url) {
        this.url = options.url;
      }
    }
	});
});
