// Filename: models/deviceTelemetry.js
define([
	'backbone'
], function(Backbone) {

	return Backbone.Model.extend({

		url: function() {
			return this.get('url');
		}

	});

});