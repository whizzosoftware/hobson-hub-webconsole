// Filename: views/dashboard/tiles/camera.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'services/polling',
	'i18n!nls/strings',
	'text!templates/dashboard/tiles/camera.html'
], function($, _, Backbone, toastr, DeviceService, PollingService, strings, template) {

	return Backbone.View.extend({
		tagName: 'div',

		template: _.template(template),

		className: "tile shadow-1",

		events: {
			'click #tileIcon': 'onIconClick',
			'click #tileButton': 'onButtonClick'
		},

		remove: function() {
			Backbone.View.prototype.remove.call(this);
		},

		close: function() {
			clearInterval(this.time);
		},

		render: function() {
			if (!this.initialRender) {
				this.$el.html(this.template({ device: this.model.toJSON(), on: this.model.isOn(), strings: strings }));
				this.initialRender = true;
			}
			this.updateImage();
			return this;
		},

		updateImage: function() {
			// start image loading if there's a preferred image URL and we're not waiting on a previous image load
			var preferredVariable = this.model.get('preferredVariable');
			if (preferredVariable && preferredVariable.name == 'imageStatusUrl' && !this.imageLoading) {
				// show the user a wait spinner
				this.showSpinner(true);
				this.imageLoading = true;

				var imageEl = this.$el.find('#image-container');
				$.ajax({
					context: this,
					url: preferredVariable.value + '?base64=true',
					type: 'GET',
					success: function(data) {
						this.showSpinner(false);
						this.imageLoading = false;
						imageEl.html($('<img src="data:image/jpg;base64,' + data + '" />'));
					},
					error: function(response) {
						this.showSpinner(false);
						this.imageLoading = false;
						var msg;
						if (response.status === 403) {
							msg = strings.AccessDenied;
						} else {
							msg = strings.ErrorOccurred;
						}
						imageEl.html('<p class="error">' + msg + '</p>');
					}
				});
			}
		},

		onIconClick: function() {
			var prefVar = this.model.get('preferredVariable');
			var newValue = null;
			if (prefVar) {
				switch (prefVar.name) {
					case 'on':
						newValue = !prefVar.value;
						DeviceService.setDeviceVariable(prefVar["@id"], newValue);
						break;
					case 'imageStatusUrl':
						this.updateImage();
						break;
				}
			}

			// if a new variable value was set, poll to detect when the change is applied
			if (newValue !== null) {
				// show the user a wait spinner
				this.showSpinner(true);

				// kick off the variable URL polling
				PollingService.poll({
					context: this,
					url: prefVar["@id"],
					interval: 1000,
					check: function(ctx, json) {
						return (json.value === newValue);
					},
					success: function(ctx) {
						ctx.showSpinner(false);
						ctx.$el.find('#work-icon').css('display', 'none');
						ctx.model.setPreferredVariableValue(newValue);
						ctx.render();
					},
					failure: function(ctx) {
						ctx.showSpinner(false);
						toastr.error('Unable to confirm device was updated');
					}
				});
			}
		},

		onButtonClick: function() {
			this.$el.trigger('deviceButtonClick', this.model);
		},

		showSpinner: function(enabled) {
			this.$el.find('#work-icon').css('display', enabled ? 'block' : 'none');
		}
	});

});