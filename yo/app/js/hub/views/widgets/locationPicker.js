// Filename: views/config/locationPicker.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/hub',
  'views/widgets/baseWidget',
  'i18n!nls/strings',
  'text!templates/widgets/locationPicker.html'
], function ($, _, Backbone, toastr, HubService, BaseWidget, strings, pluginConfigTemplate) {

  return BaseWidget.extend({

    template: _.template(pluginConfigTemplate),

    initialize: function (options) {
      this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
      this.value = options.value;
    },

    render: function () {
      this.$el.html(this.template({
        strings: strings,
        id: this.getSafeId(),
        property: this.model,
        required: this.required,
        value: this.value
      }));

      // load locations
      HubService.getLocations(this, function (model, response, options) {
        var el = options.context.$el.find('#' + options.context.getSafeId());
        el.empty();
        for (var ix = 0; ix < model.length; ix++) {
          el.append('<option value="' + model.at(ix).get('@id') + '">' + model.at(ix).get('name') + '</option>');
        }
        el.removeAttr('disabled');
      }, function (model, response, options) {
        toastr.error('Error retrieving location list');
      });

      return this;
    },

    getValue: function () {
      var id = this.$el.find('#' + this.getSafeId()).val();
      if (id) {
        return {'@id': id, name: this.$el.find('option[value="' + id + '"]').text()};
      } else {
        return null;
      }
    },

    showError: function (showError) {
      BaseWidget.prototype.showError.call(this, showError);
      if (showError) {
        this.$el.find('#location').addClass('error');
      } else {
        this.$el.find('#location').removeClass('error');
      }
    }

  });

});
