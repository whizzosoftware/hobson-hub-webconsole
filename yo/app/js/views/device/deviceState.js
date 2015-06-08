// Filename: views/device/deviceState.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/device/deviceTab',
	'views/device/lightbulb',
	'views/device/switch',
	'views/device/camera',
	'views/device/thermostat',
	'i18n!nls/strings',
	'text!templates/device/deviceState.html'
], function($, _, Backbone, DeviceTab, LightbulbView, SwitchView, CameraView, ThermostatView, strings, template) {

	return DeviceTab.extend({

		tabName: 'state',

		template: _.template(template),

		contentView: null,

		remove: function() {
			if (this.contentView) {
				this.contentView.remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				device: this.model.toJSON()
			}));

			switch (this.model.get('type')) {
				case 'LIGHTBULB':
					this.contentView = new LightbulbView({model: this.model});
					break;
				case 'SWITCH':
					this.contentView = new SwitchView({model: this.model});
					break;
				case 'CAMERA':
					this.contentView = new CameraView({model: this.model});
					break;
				case 'THERMOSTAT':
					this.contentView = new ThermostatView({model: this.model});
					break;
				default:
					break;
			}

			if (this.contentView) {
				this.$el.find('#controlContainer').html(this.contentView.render().el);
			}

			return this;
		}

	});

});