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
      this.$el.find('#work-icon').css('display', enabled ? 'block' : 'none');
    },

    onUpdateFailed: function() {
      toastr.error(strings.DeviceUpdateFailed);
      this.showSpinner(false);
    }

  });
});
