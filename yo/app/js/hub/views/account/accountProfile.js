// Filename: views/account/accountProfile.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/account/accountTab',
	'i18n!nls/strings',
	'text!templates/account/accountProfile.html'
], function($, _, Backbone, AccountTab, strings, template) {

	var ProfileView = AccountTab.extend({

		tabName: 'Profile',

		template: _.template(template),

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings
			}));
		}

	});

	return ProfileView;
});