// Filename: views/dashboard/tiles/camera.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
  'views/devices/tiles/tile',
	'i18n!nls/strings',
	'text!templates/devices/tiles/camera.html'
], function($, _, Backbone, toastr, DeviceService, TileView, strings, template) {

	return TileView.extend({
		tagName: 'div',

		template: _.template(template),

		className: "tile shadow-1",

		events: {
			'click #tileIcon': 'onIconClick',
			'click #tileButton': 'onButtonClick'
		},

    initialize: function(options) {
		  this.time = setInterval(this.updateImage.bind(this), 10000);
    },

		remove: function() {
		  clearInterval(this.time);
			Backbone.View.prototype.remove.call(this);
		},

		close: function() {
			clearInterval(this.time);
		},

		render: function() {
			if (!this.initialRender) {
				this.$el.html(this.template({
					device: this.model.toJSON(),
					available: this.available,
					on: this.model.isOn(),
					strings: strings
				}));
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
						} else if (response.status === 404) {
							msg = strings.WaitingForCameraImage;
						} else {
							msg = strings.ErrorOccurred;
						}
						imageEl.html('<p>' + msg + '</p>');
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
		},

		onButtonClick: function() {
			this.$el.trigger('deviceButtonClick', this.model);
		}

	});

});
