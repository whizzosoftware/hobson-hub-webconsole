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
      this.$el.html(this.template({
        strings: strings,
        device: this.model.toJSON(),
        variable: v
      }));

			var v = this.getVariable('imageStatusUrl');
      var v2 = this.getVariable('videoStatusUrl');
      if (v2 && v2.mediaType === 'VIDEO_MJPEG') {
        this.$el.find('#image-container').html($('<img width="100%" src="' + v2.value + '" />'));
      } else if (v) {
				$.ajax({
					context: this,
					url: v.value + '?base64=true',
					type: 'GET',
					success: function(data) {
						this.$el.find('#image-container').html($('<img src="data:image/jpg;base64,' + data + '" />'));
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
