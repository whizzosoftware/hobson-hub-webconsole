// Filename: models/hubs.js
define([
	'backbone',
	'models/hub'
], function(Backbone, HubModel) {

	var HubsModel = Backbone.Collection.extend({

		model: HubModel,

		initialize: function(url) {
			this.url = url;
		}

	});

	return HubsModel;
});