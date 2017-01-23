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
      this.updateState();
    },

    onDeviceVariableUpdate: function(event) {
      if (this.model.has('preferredVariable') && event.id == this.model.get('preferredVariable')['@id'] && event.value !== this.model.get('preferredVariable')['value']) {
        this.model.setPreferredVariableValue(event['value']);
        this.available = true;
        clearInterval(this.timeoutInterval);
        this.showSpinner(false);
        this.updateState();
      } else if (!this.available) {
        this.available = true;
        this.updateState();
      }
    },

    firePreferredVariableUpdate: function() {
      this.showSpinner(true);
      this.timeoutInterval = setTimeout(this.onUpdateFailed.bind(this), 5000);
    },

    updateState: function() {
      var e = this.$el.find('#tileIcon');
      if (this.available) {
        e.removeClass('disabled');
      } else {
        e.addClass('disabled');
      }
      return e;
    },

    showSpinner: function(enabled) {
      if (!this.spinnerVisible && enabled) {
        this.spinnerVisible = true;
        this.$el.find('#work-icon').fadeIn(100);
      } else if (this.spinnerVisible && !enabled) {
        this.spinnerVisible = false;
        this.$el.find('#work-icon').fadeOut(100);
      }
    },

    onUpdateFailed: function() {
      toastr.error(strings.DeviceUpdateFailed);
      this.showSpinner(false);
    }

  });
});
