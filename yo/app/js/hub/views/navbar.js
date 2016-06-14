// Filename: views/navbar.js
define([
	'jquery',
	'underscore',
	'backbone',
  'services/auth',
	'models/session',
	'views/powerOffConfirm',
	'i18n!nls/strings',
	'text!templates/navbar.html'
], function($, _, Backbone, AuthService, session, PowerOffConfirmView, strings, navbarTemplate) {
	var DashboardView = Backbone.View.extend({

		template: _.template(navbarTemplate),

		events: {
			'click #sidebar-button': 'onClickSidebar',
			'click #power-button': 'onClickPowerOff',
      'click #logout': 'onClickLogout'
		},

		render: function() {
			this.$el.html(
				this.template({
					strings: strings,
					user: session.hasUser() ? session.getUser().toJSON() : null,
					hub: session.hasSelectedHub() ? session.getSelectedHub().toJSON() : null,
					showDataStreams: session.hasDataStreams(),
					showAccount: session.showAccount(),
					showActivityLog: session.showActivityLog(),
					showPowerOff: session.showPowerOff(),
					fragment: Backbone.history.getFragment()
				})
			);

			this.$el.foundation('dropdown', 'reflow');

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
		},

		onClickPowerOff: function() {
			var url = session.hasSelectedHub() && session.getSelectedHub().get('links') ? session.getSelectedHub().get('links').powerOff : null;
			if (url) {
				var el = this.$el.find('#power-off-modal');
				el.html(new PowerOffConfirmView({url: url}).render().el);
				el.foundation('reveal', 'open');
			}
		},

    onClickLogout: function() {
      AuthService.logout();
    }
	});

	return DashboardView;
});
