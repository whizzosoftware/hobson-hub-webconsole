// Filename: models/actionClass.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({
		initialize: function(options) {
			if (options) {
				if (options.links && options.links.self) {
					this.url = options.links.self;
				} else if (options.url) {
					this.url = options.url;
				}
			}
		},
	});
});