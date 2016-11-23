// Filename: views/collection/devices.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/collection/device'
], function ($, _, Backbone, DeviceView) {

  return Backbone.View.extend({

    tagName: 'ul',

    initialize: function (options) {
      this.devices = options.devices;
      this.value = options.value;
      this.subviews = [];
    },

    remove: function () {
      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].remove();
      }
      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].remove();
      }

      this.$el.html('');
      for (i = 0; i < this.devices.length; i++) {
        var device = this.devices.at(i);
        var v = new DeviceView({
          device: device,
          selected: this.value.indexOf(device.get('@id')) > -1
        });
        this.$el.append(v.render().el);
        this.subviews.push(v);
      }
      return this;
    },

    setSelectedDevices: function (selectedDevices) {
      var selectedDeviceIds = [];
      for (var i = 0; i < selectedDevices.length; i++) {
        selectedDeviceIds.push(selectedDevices[i].get('@id'));
      }
      for (i = 0; i < this.subviews.length; i++) {
        var d = this.subviews[i].device.get('@id');
        var b = ($.inArray(d, selectedDeviceIds) > -1);
        this.subviews[i].setSelected(b);
      }
    }

  });

});
