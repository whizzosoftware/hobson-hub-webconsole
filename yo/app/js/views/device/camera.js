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
				// we only want to render the HTML image tag once
				if (!this.initialRender) {
					this.$el.html(this.template({
						strings: strings,
						device: this.model.toJSON(),
						variable: v
					}));
					this.initialRender = true;
				// any subsequent renders should update the image via JQuery -- this prevents flicker
				} else {
					this.$el.find('#image').attr('src', v.value + '?' + new Date().getTime());
				}
			} else {
				this.$el.html('<p class="notice">' + this.strings.DeviceMissingVariable + '</p>');
			}

			return this;
		}

	});

});