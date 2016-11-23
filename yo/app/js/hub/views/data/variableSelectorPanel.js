// Filename: views/data/variableSelectorsPanel
define([
  'jquery',
  'underscore',
  'backbone',
  'views/widgets/stringPicker',
  'views/widgets/devicesPicker',
  'views/widgets/variablePicker',
  'i18n!nls/strings',
  'text!templates/data/variableSelectorsPanel.html'
], function ($, _, Backbone, StringPickerView, DevicesPickerView, VariablePickerView, strings, template) {

  return Backbone.View.extend({
    template: _.template(template),

    tagName: 'ul',

    className: "accordion",

    attributes: {
      'data-accordion': ''
    },

    events: {
      'devicesSelectionChange': 'onDevicesSelectionChange',
      'click #buttonAdd': 'onClickAdd'
    },

    initialize: function (options) {
      this.devices = options.devices;
      this.model = {
        name: '',
        variables: []
      };
      this.stringPicker = new StringPickerView({
        model: {
          '@id': 'fieldName',
          name: strings.Name,
          value: null,
          constraints: {
            required: true
          }
        }
      });
      this.devicesPicker = new DevicesPickerView({
        model: {
          name: 'Device',
          constraints: {
            required: true
          }
        },
        single: true,
        showDescription: false
      });
      this.variablePicker = new VariablePickerView({
        model: {
          constraints: {
            required: true
          }
        },
        single: true
      });
    },

    remove: function () {
      this.devicesPicker.remove();
      this.variablePicker.remove();
      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      this.$el.append(
        this.template({
          strings: strings
        })
      );

      this.$el.find('#nameSelector').html(this.stringPicker.render().el);
      this.$el.find('#deviceSelector').html(this.devicesPicker.render().el);
      this.$el.find('#variableSelector').html(this.variablePicker.render().el);

      return this;
    },

    onDevicesSelectionChange: function (evt, devices) {
      var device = (devices.constructor === Array) ? devices[0] : devices;
      if (device) {
        this.variablePicker.setDevice(device);
      } else {
        this.variablePicker.setDevice(null);
      }
    },

    onClickAdd: function (evt) {
      this.stringPicker.showError(null);
      this.devicesPicker.showError(null);
      this.variablePicker.showError(null);

      var name = this.$el.find('#fieldName').val();
      if (name) {
        if (this.devicesPicker.value.length > 0) {
          if (this.variablePicker.model.value.length > 0) {
            for (var ix in this.variablePicker.model.value) {
              this.model.variables.push(this.variablePicker.model.value[ix]);
            }
            this.$el.trigger('addField', {
              name: this.$el.find('#fieldName').val(),
              variable: this.variablePicker.model
            });
          } else {
            this.variablePicker.showError('Name!!!');
          }
        } else {
          this.devicesPicker.showError('Name!!!');
        }
      } else {
        this.stringPicker.showError('Name!!!');
      }
    }

  });

});
