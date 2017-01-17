// Filename: views/dashboard/tiles/tile.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/device',
  'i18n!nls/strings'
], function($, _, Backbone, toastr, DeviceService, strings) {
  return Backbone.View.extend({
    initialize: function(options) {
      this.available = DeviceService.isDeviceAvailable(this.model);
      this.spinnerVisible = false;
    },

    onDeviceAvailability: function(available) {
      this.available = available;
      this.render();
    },

    onDeviceVariableUpdate: function(event) {
      if (this.model.has('preferredVariable') && event.id == this.model.get('preferredVariable')['@id']) {
        this.model.setPreferredVariableValue(event['value']);
        this.available = true;
        clearInterval(this.timeoutInterval);
        this.render();
      } else if (!this.available) {
        this.available = true;
        this.render();
      }
    },

    firePreferredVariableUpdate: function() {
      this.showSpinner(true);
      this.timeoutInterval = setTimeout(this.onUpdateFailed.bind(this), 2000);
    },

    showSpinner: function(enabled) {
      if (!this.spinnerVisible && enabled) {
        this.$el.find('#work-icon').fadeIn(100);
        this.spinnerVisible = true;
      } else if (this.spinnerVisible && !enabled) {
        this.$el.find('#work-icon').fadeOut(100);
        this.spinnerVisible = false;
      }
    },

    onUpdateFailed: function() {
      toastr.error(strings.DeviceUpdateFailed);
      this.showSpinner(false);
    }

  });
});
