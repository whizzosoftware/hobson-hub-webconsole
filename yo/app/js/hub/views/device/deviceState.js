// Filename: views/device/deviceState.js
define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'smartmenus',
  'services/event',
  'services/device',
  'views/device/deviceTab',
  'views/device/lightbulb',
  'views/device/switch',
  'views/device/camera',
  'views/device/thermostat',
  'views/device/sensor',
  'views/device/weatherStation',
  'views/device/securityPanel',
  'i18n!nls/strings',
  'text!templates/device/deviceState.html'
], function ($, _, Backbone, moment, smartmenus, EventService, DeviceService, DeviceTab, LightbulbView, SwitchView, CameraView, ThermostatView, SensorView, WeatherStationView, SecurityPanelView, strings, template) {

  return DeviceTab.extend({

    tabName: 'state',

    template: _.template(template),

    contentView: null,

    initialize: function (options) {
      this.polling = options.polling;

      this.available = DeviceService.isDeviceAvailable(this.model);
      this.toggle = true;

      // listen for devVarsUpdate events and pass along if applicable
      this.subscription = this.onVariableUpdate.bind(this);
      this.subscription2 = this.onDeviceAvailability.bind(this);
      EventService.subscribe('devVarsUpdate', this.subscription);
      EventService.subscribe('deviceNotAvailable', this.subscription2);
    },

    onVariableUpdate: function (event) {
      if (this.contentView.eventCallback(event)) {
        this.setAvailability(true);
      }
    },

    onDeviceAvailability: function(event) {
      this.setAvailability(true);
    },

    setAvailability: function(available) {
      this.available = available;
      this.contentView.setAvailability(available);
      if (available) {
        this.model.set('lastCheckIn', new Date().getTime());
      }
      this.render();
    },

    remove: function () {
      EventService.unsubscribe(this.subscription);
      EventService.unsubscribe(this.subscription2);
      if (this.contentView) {
        this.contentView.remove();
      }
      Backbone.View.prototype.remove.call(this);
    },

    renderTabContent: function (el) {
      el.html(this.template({
        strings: strings,
        device: this.model.toJSON(),
        available: this.available,
        lastContactString: this.createLastCheckInString()
      }));

      switch (this.model.get('type')) {
        case 'LIGHTBULB':
          this.contentView = new LightbulbView({
            model: this.model,
            polling: this.polling
          });
          break;
        case 'SWITCH':
          this.contentView = new SwitchView({model: this.model, available: this.available});
          break;
        case 'CAMERA':
          this.contentView = new CameraView({model: this.model, available: this.available});
          break;
        case 'THERMOSTAT':
          this.contentView = new ThermostatView({model: this.model, available: this.available});
          break;
        case 'SENSOR':
          this.contentView = new SensorView({model: this.model, available: this.available});
          break;
        case 'WEATHER_STATION':
          this.contentView = new WeatherStationView({model: this.model, available: this.available});
          break;
        case 'SECURITY_PANEL':
          this.contentView = new SecurityPanelView({model: this.model, available: this.available});
          break;
        default:
          break;
      }

      if (this.contentView) {
        this.$el.find('#controlContainer').html(this.contentView.render().el);
      }

      return this;
    },

    createLastCheckInString: function () {
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
