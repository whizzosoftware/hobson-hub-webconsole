// Filename: views/device/securityPanel.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'models/variable',
  'views/device/baseStatus',
  'i18n!nls/strings',
  'text!templates/device/securityPanel.html'
], function($, _, Backbone, toastr, Variable, BaseStatus, strings, template) {

  return BaseStatus.extend({

    template: _.template(template),

    events: {
      'click #armButton': 'onArmClick'
    },

    render: function(el) {
      console.log(this.variables);
      this.$el.html(this.template({
        strings: strings,
        device: this.model.toJSON(),
        variables: this.variables
      }));

      return this;
    },

    onArmClick: function(e) {
      e.preventDefault();

      if (!this.hasPendingUpdates()) {
        var armVar = this.getVariable('armed');
        this.setVariableValues({armed: !armVar.value});
        this.pendingUpdate = true;
        this.showSpinner(true);
      } else {
        return false;
      }
    },

    onVariableUpdate: function(name) {
      this.showSpinner(false);
      this.render();
    },

    onVariableFailure: function() {
      toastr.error('Failed to update device state');
      this.showSpinner(false, function() {
        this.render();
      }.bind(this));
    },

    onVariableTimeout: function() {
      toastr.error('Failed to update device state');
      this.showSpinner(false, function() {
        this.render();
      }.bind(this));
    },

    showSpinner: function(show, callback) {
      if (show) {
        this.$el.find('#spinner').animate({'opacity': 1}, callback);
      } else {
        this.$el.find('#spinner').animate({'opacity': 0}, callback);
      }
    }

  });

});
