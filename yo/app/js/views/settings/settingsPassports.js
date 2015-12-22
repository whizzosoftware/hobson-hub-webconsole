// Filename: views/settings/settingsPassports.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'models/propertyContainer',
	'models/itemList',
	'models/logEntry',
	'services/device',
	'views/settings/settingsTab',
	'views/settings/devicePassportsTable',
	'views/settings/addDevicePassport',
	'i18n!nls/strings',
	'text!templates/settings/settingsPassports.html'
], function($, _, Backbone, toastr, session, Config, ItemList, LogEntry, DeviceService, SettingsTab, DevicePassportsTableView, AddDevicePassportView, strings, template) {

	return SettingsTab.extend({

		tabName: 'passports',

		template: _.template(template),

		events: {
			'click #add-button': 'onAddButton'
		},

		initialize: function(options) {
			$(document).on('closed.fndtn.reveal', '[data-reveal]', $.proxy(function(e) {
				this.onRevealClosed();
			}, this));
		},

		remove: function() {
			$(document).off('closed.fndtn.reveal');
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				hub: this.hub
			}));

			DeviceService.getDevicePassports(this, '/api/v1/users/local/hubs/local/devicePassports?expand=item',
				function(model, response, options) {
					options.context.passportTableView = new DevicePassportsTableView({model: model});
					$('#passport-table-container').append(options.context.passportTableView.render().el);
				},
				function(model, response, options) {
					console.debug('error: ', response);
				}
			);
		},

		onAddButton: function() {
			var el = this.$el.find('#add-passport-modal');
			el.html(new AddDevicePassportView().render().el);
			el.foundation('reveal', 'open');
		},

		onRevealClosed: function() {
			console.log('reveal closed');
			console.debug(this);
			this.render();
		}

	});

});
