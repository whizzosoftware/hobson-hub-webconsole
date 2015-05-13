// Filename: views/navbar.js
define([
	'jquery',
	'underscore',
	'backbone',
	'foundation.core',
	'models/session',
	'i18n!nls/strings',
	'text!templates/navbar.html'
], function($, _, Backbone, Foundation, session, strings, navbarTemplate) {
	var DashboardView = Backbone.View.extend({

		template: _.template(navbarTemplate),

		events: {
			'click #sidebar-button': 'onClickSidebar'
		},

		render: function() {
			console.debug('rendering navbar');
			this.$el.html(
				this.template({
					strings: strings,
					user: session.hasUser() ? session.getUser().toJSON() : null,
					hub: session.hasSelectedHub() ? session.getSelectedHub().toJSON() : null,
					fragment: Backbone.history.getFragment()
				})
			);

			this.$el.foundation();

			return this;
		},
		
		onClickSidebar: function() {
			$.sidr('toggle', 'sidr');
		}
	});

	return DashboardView;
});