// Filename: views/account/hub.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'views/account/hub',
	'i18n!nls/strings',
	'text!templates/account/hub.html'
], function($, _, Backbone, session, HubView, strings, template) {

	var HubsView = Backbone.View.extend({

		template: _.template(template),

		tagName: 'li',

		initialize: function(options) {
			this.hub = options.hub;
		},

		render: function() {
			this.$el.html(this.template({
				user: session.getUser().toJSON(),
				hub: this.hub.toJSON()
			}));
			return this;
		}		

	});

	return HubsView;
});