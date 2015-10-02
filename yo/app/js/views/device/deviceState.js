// Filename: views/device/deviceState.js
define([
	'jquery',
	'underscore',
	'backbone',
  'moment',
	'views/device/deviceTab',
	'views/device/lightbulb',
	'views/device/switch',
	'views/device/camera',
	'views/device/thermostat',
	'views/device/sensor',
	'views/device/weatherStation',
	'i18n!nls/strings',
	'text!templates/device/deviceState.html'
], function($, _, Backbone, moment, DeviceTab, LightbulbView, SwitchView, CameraView, ThermostatView, SensorView, WeatherStationView, strings, template) {

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
				device: this.model.toJSON(),
        lastContactString: this.createLastCheckInString()
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
				case 'SENSOR':
					this.contentView = new SensorView({model: this.model});
					break;
				case 'WEATHER_STATION':
					this.contentView = new WeatherStationView({model: this.model});
					break;
				default:
					break;
			}

			if (this.contentView) {
				this.$el.find('#controlContainer').html(this.contentView.render().el);
			}

			return this;
		},

    createLastCheckInString: function() {
      var s = null;
      if (this.model.get('lastCheckIn')) {
        s = new moment(this.model.get('lastCheckIn')).fromNow();
      } else {
        s = 'Never';
      }
      return s;
    }

	});

});
