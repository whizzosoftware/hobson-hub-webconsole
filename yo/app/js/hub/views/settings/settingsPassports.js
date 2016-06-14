// Filename: views/settings/settingsPassports.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'services/hub',
	'services/device',
	'models/propertyContainer',
	'models/itemList',
	'views/settings/settingsTab',
	'views/settings/devicePassportsTable',
	'views/settings/addDevicePassport',
	'i18n!nls/strings',
	'text!templates/settings/settingsPassports.html'
], function($, _, Backbone, toastr, session, HubService, DeviceService, Config, ItemList, SettingsTab, DevicePassportsTableView, AddDevicePassportView, strings, template) {

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
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					DeviceService.getDevicePassports(options.context, model.get('devicePassports')['@id'],
						function(model, response, options) {
							el.html(options.context.template({
								strings: strings,
								hub: model
							}));
							options.context.passportTableView = new DevicePassportsTableView({model: model});
							$('#passport-table-container').append(options.context.passportTableView.render().el);
						},
						function(model, response, options) {
							toastr.error(strings.ErrorOccurred);
						}
					);
				}
			});
		},

		onAddButton: function() {
			var el = this.$el.find('#add-passport-modal');
			el.html(new AddDevicePassportView().render().el);
			el.foundation('reveal', 'open');
		},

		onRevealClosed: function() {
			this.render();
		}

	});

});
