// Filename: models/devicePassport.js
define([
	'backbone'
], function(Backbone) {

	return Backbone.Model.extend({

		initialize: function(options) {
			this.url = options.url;
		}

	});

});
