// Filename: views/dashboard/section.js
define([
  'jquery',
  'underscore',
  'backbone',
  'bridget',
  'masonry',
  'views/devices/tiles/camera',
  'views/devices/tiles/lightbulb',
  'views/devices/tiles/sensor',
  'views/devices/tiles/switch',
  'views/devices/tiles/thermostat',
  'views/devices/tiles/weatherStation',
  'views/devices/tiles/unknown',
  'i18n!nls/strings',
  'text!templates/devices/tileGroup.html'
], function ($, _, Backbone, bridget, Masonry, CameraTileView, LightbulbTileView, SensorTileView, SwitchTileView, ThermostatTileView, WeatherStationTileView, UnknownTileView, strings, template) {

  return Backbone.View.extend({
    className: 'dash-section',

    initialize: function (options) {
      bridget('masonry', Masonry);

      this.name = options.name;
      this.filter = options.filter;
      this.initialRender = true;
      this.template = _.template(options.template);
      this.subviews = {};
      this.subviewCount = 0;
    },

    remove: function () {
      for (var ix in this.subviews) {
        this.subviews[ix].remove();
        this.subviews[ix] = null;
      }
      Backbone.View.prototype.remove.call(this);
    },

    updateModel: function (model) {
      if (this.filter) {
        this.model = model.filter(this.filter);
      } else {
        this.model = model;
      }
    },

    hasContent: function () {
      return (this.model ? this.model.length > 0 : false);
    },

    render: function () {
      if (this.model) {
        if (this.initialRender) {
          this.$el.html(this.template({name: this.name, model: this.model, strings: strings}));
          this.initialRender = false;
        }
        this.renderSection(this.model);
      }
      return this;
    },

    renderSection: function () {
      // NO-OP to be implemented by subclasses
    },

    dispatchEvent: function (name, event) {
      for (var p in this.subviews) {
        if (this.subviews.hasOwnProperty(p)) {
          var sv = this.subviews[p];
          if (typeof sv[name] == 'function') {
            sv[name](event);
          }
        }
      }
    }


  });

});
