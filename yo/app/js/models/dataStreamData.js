// Filename: models/dataStreamData.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({

		initialize: function(options) {
			if (options.links && options.links.self) {
				this.url = options.links.self;
			} else if (options.url) {
				this.url = options.url;
			}
		},

		url: function() {
			return this.url;
		},

	});
});