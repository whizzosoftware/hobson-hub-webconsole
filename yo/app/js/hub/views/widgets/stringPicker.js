// Filename: views/config/stringPicker.js
define([
  'jquery',
  'underscore',
  'backbone',
  'services/plugin',
  'views/widgets/baseWidget',
  'i18n!nls/strings',
  'text!templates/widgets/stringPicker.html',
  'text!templates/widgets/stringEnumPicker.html'
], function ($, _, Backbone, PluginService, BaseWidget, strings, template, template2) {

  return BaseWidget.extend({

    initialize: function (options) {
      this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
      this.value = options.value;
    },

    render: function () {
      if (this.model.enum) {
        var id = this.getSafeId();
        this.$el.html(_.template(template2)({
          strings: strings,
          id: id,
          property: this.model,
          required: this.required,
          value: this.value
        }));
        var select = this.$el.find('#' + id);
        var val = this.value;
        $.each(this.model.enum, function (key, value) {
          var option = $("<option></option>").attr("value", key).text(value);
          if (key === val) {
            option.attr('selected', 'true');
          }
          select.append(option);
        });
      } else {
        this.$el.html(_.template(template)({
          strings: strings,
          id: this.getSafeId(),
          property: this.model,
          required: this.required,
          value: this.value
        }));
      }
      return this;
    },

    getValue: function () {
      if (this.model.enum) {
        return this.$el.find('select#' + this.getSafeId()).val();
      } else {
        return this.$el.find('input#' + this.getSafeId()).val();
      }
    },

  });

});
