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

		render: function() {
			console.debug('ind. model: ', this.model);
			this.$el.html(this.template({
				user: session.getUser().toJSON(),
				hub: this.model.toJSON()
			}));
			return this;
		}		

	});

	return HubsView;
});