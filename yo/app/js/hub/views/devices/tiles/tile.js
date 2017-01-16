// Filename: views/dashboard/tiles/tile.js
define([
  'jquery',
  'underscore',
  'backbone',
  'services/device'
], function($, _, Backbone, DeviceService) {
  return Backbone.View.extend({
    initialize: function(options) {
      this.available = DeviceService.isDeviceAvailable(this.model);
    },

    onDeviceAvailability: function(available) {
      this.available = available;
      this.render();
    },

    onDeviceVariableUpdate: function(event) {
      if (this.model.has('preferredVariable') && event.id == this.model.get('preferredVariable')['@id']) {
        this.model.setPreferredVariableValue(event['value']);
        this.showSpinner(false);
        this.render();
      } else if (!this.available) {
        this.available = true;
        this.render();
      }
    }
  });
});
