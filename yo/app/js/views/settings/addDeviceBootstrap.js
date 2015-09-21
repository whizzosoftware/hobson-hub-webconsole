// Filename: views/settings/addDeviceBootstrap.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'i18n!nls/strings',
	'text!templates/settings/addDeviceBootstrap.html'
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

			DeviceService.addDeviceBootstrap(this, '/api/v1/users/local/hubs/local/deviceBootstraps', deviceId)
				.success(function(response) {
					console.debug('success');
					this.$el.foundation('reveal', 'close');
					toastr.success('Device bootstrap created.');
				}).fail(function(response) {
					console.debug('fail');
					toastr.error('Error creating device bootstrap. See the log for details.');
				});
		}

	});

});