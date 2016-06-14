// Filename: views/device/camera.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/camera.html'
], function($, _, Backbone, toastr, Variable, BaseStatusView, strings, template) {

	return BaseStatusView.extend({

		template: _.template(template),

		alwaysRefresh: true,

		initialRender: false,

		render: function(el) {
			var v = this.getVariable('imageStatusUrl');
			if (v) {
				this.$el.html(this.template({
					strings: strings,
					device: this.model.toJSON(),
					variable: v
				}));

				var imageEl = this.$el.find('#image-container');
				$.ajax({
					context: this,
					url: v.value + '?base64=true',
					type: 'GET',
					success: function(data) {
						imageEl.html($('<img src="data:image/jpg;base64,' + data + '" />'));
					},
					error: function(response) {
						var msg;
						if (response.status === 403) {
							msg = strings.AccessDenied;
						} else {
							msg = strings.ErrorOccurred;
						}
						this.$el.find('#image-container').html('<p class="error">' + msg + '</p>');
					}
				});				
			} else {
				this.$el.html('<p class="notice">' + strings.DeviceMissingVariable + '</p>');
			}

			return this;
		}

	});

});