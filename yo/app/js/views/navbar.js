// Filename: views/navbar.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'i18n!nls/strings',
	'text!templates/navbar.html'
], function($, _, Backbone, session, strings, navbarTemplate) {
	var DashboardView = Backbone.View.extend({

		template: _.template(navbarTemplate),

		events: {
			'click #sidebar-button': 'onClickSidebar'
		},

		render: function() {
			this.$el.html(
				this.template({
					strings: strings,
					user: session.hasUser() ? session.getUser().toJSON() : null,
					hub: session.hasSelectedHub() ? session.getSelectedHub().toJSON() : null,
					fragment: Backbone.history.getFragment()
				})
			);

			return this;
		},
		
		updateTabs: function() {
			var fragment = Backbone.history.getFragment();
			this.$el.find('.subnav-item a').each(function(index, e) {
				var el = $(e);
				if (fragment.indexOf(el.attr('id')) > -1) {
					el.addClass('active');
				} else {
					el.removeClass('active');
				}
			});
		},

		onClickSidebar: function() {
			$.sidr('toggle', 'sidr');
		}
	});

	return DashboardView;
});