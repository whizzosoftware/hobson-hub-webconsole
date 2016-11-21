// Filename: views/settings/addDevicePassport.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'i18n!nls/strings',
	'text!templates/settings/addDevicePassport.html'
], function($, _, Backbone, toastr, DeviceService, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'click #cancelButton': 'onCancelButton',
			'click #saveButton': 'onSaveButton'
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings
			}));

			return this;
		},

		onCancelButton: function(event) {
			event.preventDefault();
			this.$el.foundation('reveal', 'close');
		},

		onSaveButton: function(event) {
			event.preventDefault();

			var deviceId = this.$el.find('#deviceId').val();

			DeviceService.addDevicePassport(this, deviceId)
				.success(function(response) {
					this.$el.foundation('reveal', 'close');
					toastr.success(strings.DevicePassportCreated);
				}).fail(function(response) {
					if (response.status === 202) {
						this.$el.foundation('reveal', 'close');
						toastr.success(strings.DevicePassportCreated);
					} else {
						toastr.error(strings.DevicePassportCreationError);
					}
				});
		}

	});

});
