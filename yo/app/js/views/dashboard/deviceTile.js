// Filename: views/dashboard
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'services/polling',
	'i18n!nls/strings',
	'text!templates/dashboard/deviceTile.html'
], function($, _, Backbone, toastr, DeviceService, PollingService, strings, deviceTileTemplate) {

	var DeviceTileView = Backbone.View.extend({
		tagName: 'div',

		template: _.template(deviceTileTemplate),

		className: "tile",

		events: {
			'click #tileIcon': 'onIconClick',
			'click #tileButton': 'onButtonClick'
		},

		initialize: function(device) {
			this.device = device;
		},

		close: function() {
			clearInterval(this.time);
		},

		render: function() {
			this.$el.html(this.template({ device: this.device.toJSON(), on: this.device.isOn(), strings: strings }));
			this.updateImage();
			return this;
		},

		updateImage: function() {
			// start image loading if there's a preferred image URL
			var preferredVariable = this.device.get('preferredVariable');
			if (preferredVariable.name == 'imageStatusUrl') {
				// show the user a wait spinner
				this.showSpinner(true);

				var imageEl = this.$el.find('#image-container');
				$.ajax({
					context: this,
					url: preferredVariable.value + '?base64=true',
					type: 'GET',
					success: function(data) {
						this.showSpinner(false);
						imageEl.html($('<img src="data:image/jpg;base64,' + data + '" />'));
					},
					error: function(response) {
						this.showSpinner(false);
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
			var prefVar = this.device.get('preferredVariable');
			var newValue = null;
			if (prefVar) {
				switch (prefVar.name) {
					case 'on':
						newValue = !prefVar.value;
						DeviceService.setDeviceVariable(prefVar.links.self, newValue);
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
					url: prefVar.links.self,
					interval: 1000,
					check: function(ctx, json) {
						return (json.value === newValue);
					},
					success: function(ctx) {
						ctx.showSpinner(false);
						ctx.$el.find('#work-icon').css('display', 'none');
						ctx.device.setPreferredVariableValue(newValue);
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
			console.debug('tile.onButtonClick');
			this.$el.trigger('deviceButtonClick', this.device);
		},

		showSpinner: function(enabled) {
			this.$el.find('#work-icon').css('display', enabled ? 'block' : 'none');
		}
	});

	return DeviceTileView;
});