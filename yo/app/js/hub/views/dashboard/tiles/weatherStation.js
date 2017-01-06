// Filename: views/dashboard/tiles/weatherStation.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/event',
  'services/device',
  'services/polling',
  'i18n!nls/strings',
  'text!templates/dashboard/tiles/weatherStation.html'
], function ($, _, Backbone, toastr, EventService, DeviceService, PollingService, strings, template) {

  return Backbone.View.extend({
    tagName: 'div',

    template: _.template(template),

    className: "tile shadow-1",

    events: {
      'click #tileButton': 'onButtonClick'
    },

    initialize: function (options) {
      this.subscription = this.onVarUpdate.bind(this);
      EventService.subscribe('devVarsUpdate', this.subscription);
    },

    onVarUpdate: function (event) {
      if (this.model.has('preferredVariable') && event.id == this.model.get('preferredVariable')['@id']) {
        this.model.setPreferredVariableValue(event['value']);
        this.render();
      }
    },

    remove: function () {
      EventService.unsubscribe(this.subscription);
      Backbone.View.prototype.remove.call(this);
    },

    close: function () {
      clearInterval(this.time);
    },

    render: function () {
      this.$el.html(this.template({
        device: this.model.toJSON(),
        available: DeviceService.isDeviceAvailable(this.model),
        on: this.model.isOn(),
        strings: strings
      }));
      return this;
    },

    onButtonClick: function () {
      this.$el.trigger('deviceButtonClick', this.model);
    }
  });

});
