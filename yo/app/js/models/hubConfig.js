// Filename: models/hubConfig.js
define([
	'backbone'
], function(Backbone) {
	var HubModel = Backbone.Model.extend({

		initialize: function(options) {
			if (options.links && options.links.self) {
				this.url = options.links.self;
			} else if (options.url) {
				this.url = options.url;
			}
		},

		hasLatLong: function() {
			return (this.get('values') && this.get('values').latitude && this.get('values').longitude);
		},

	});

	return HubModel;
});