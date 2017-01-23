// Filename: views/dashboard/tiles/weatherStation.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/event',
  'services/device',
  'views/devices/tiles/tile',
  'i18n!nls/strings',
  'text!templates/devices/tiles/weatherStation.html'
], function ($, _, Backbone, toastr, EventService, DeviceService, TileView, strings, template) {

  return TileView.extend({
    tagName: 'div',

    template: _.template(template),

    className: "tile shadow-1",

    events: {
      'click #tileButton': 'onButtonClick'
    },

    render: function () {
      this.$el.html(this.template({
        device: this.model.toJSON(),
        available: this.available,
        on: this.model.isOn(),
        strings: strings
      }));
      this.updateState();
      return this;
    },

    updateState: function() {
      TileView.prototype.updateState.bind(this).call();

      var e = this.$el.find('#tempValue');
      if (e && this.model.get('preferredVariable') && this.model.get('preferredVariable').value) {
        e.html(Math.round(this.model.get('preferredVariable').value) + '&deg;');
      } else {
        e.html('<i class="fa fa-question"></i>');
      }
    },

    onButtonClick: function () {
      this.$el.trigger('deviceButtonClick', this.model);
    }

  });

});
