// Filename: models/hub.js
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

		hasServer: function() {
			var email = this.get('email');
			return (email && email.server && email.server !== '');
		},

		hasGmailServer: function() {
			var email = this.get('email');
			return (email && email.server === 'smtp.gmail.com');
		},

		hasOtherServer: function() {
			var email = this.get('email');
			return (email && email.server !== 'smtp.gmail.com');
		}
	});

	return HubModel;
});