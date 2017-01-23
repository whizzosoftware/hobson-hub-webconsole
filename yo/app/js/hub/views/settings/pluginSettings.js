// Filename: views/pluginConfig
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'models/propertyContainer',
  'views/widgets/booleanPicker',
  'views/widgets/stringPicker',
  'views/widgets/devicesPicker',
  'views/widgets/serialPortPicker',
  'views/widgets/timePicker',
  'i18n!nls/strings',
  'text!templates/settings/pluginSettings.html'
], function ($, _, Backbone, toastr, Config, BooleanPropertyView, StringPropertyView, DevicesPropertyView, SerialPortPropertyView, TimePickerView, strings, pluginSettingsTemplate) {

  return Backbone.View.extend({

    template: _.template(pluginSettingsTemplate),

    events: {
      'click #saveButton': 'onClickSave',
      'click #cancelButton': 'onClickCancel'
    },

    initialize: function(options) {
      this.subviews = [];
    },

    remove: function () {
      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].remove();
      }
      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      this.$el.html(this.template({
        strings: strings,
        plugin: this.model.toJSON()
      }));

      var formEl = this.$el.find('form');

      var properties = this.model.get('cclass').supportedProperties;
      for (var ix in properties) {
        var property = properties[ix];
        var v;
        switch (property.type) {
          case 'BOOLEAN':
            v = new BooleanPropertyView({
              model: property,
              value: this.model.get('configuration').values ? this.model.get('configuration').values[property['@id']] : null
            });
            break;
          case 'DEVICE':
            v = new DevicesPropertyView({
              model: property,
              value: this.model.get('configuration').values ? this.model.get('configuration').values[property['@id']] : null,
              single: true
            });
            break;
          case 'DEVICES':
            v = new DevicesPropertyView({
              model: property,
              value: this.model.get('configuration').values ? this.model.get('configuration').values[property['@id']] : null,
              single: false
            });
            break;
          case 'SERIAL_PORT':
            v = new SerialPortPropertyView({
              model: property,
              value: this.model.get('configuration').values ? this.model.get('configuration').values[property['@id']] : null
            });
            break;
          case 'TIME':
            v = new TimePickerView({
              mode: 2,
              model: property,
              value: this.model.get('configuration').values ? this.model.get('configuration').values[property['@id']] : null
            });
            break;
          default:
            v = new StringPropertyView({
              id: property['@id'],
              model: property,
              value: this.model.get('configuration').values ? this.model.get('configuration').values[property['@id']] : null
            });
            break;
        }
        if (v) {
          formEl.append(v.render().el);
          this.subviews.push(v);
        }
      }

      return this;
    },

    onClickSave: function (event) {
      event.preventDefault();

      this.clearErrors();

      // build the configuration object
      var config = new Config({url: this.model.get('configuration')['@id']});
      config.set('cclass', {
        '@id': this.model.get('cclass')['@id']
      });
      for (var i = 0; i < this.subviews.length; i++) {
        var v = this.subviews[i];
        config.setProperty(v.getId(), v.getValue());
      }
      config.set('id', this.model.get('@id'));

      // validate it
      var fails = config.validate(this.model.get('cclass').supportedProperties);
      if (fails) {
        this.showErrors(fails);
      } else {
        config.save(null, {
          error: function (model, response) {
            if (response.status === 202) {
              toastr.success(strings.PluginConfigurationSaved);
            } else {
              toastr.error(strings.PluginConfigurationNotSaved);
            }
          }
        });
        this.$el.foundation('reveal', 'close');
      }
    },

    onClickCancel: function (event) {
      event.preventDefault();
      this.$el.foundation('reveal', 'close');
    },

    clearErrors: function () {
      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].showError(false);
      }
    },

    showErrors: function (fields) {
      for (var i = 0; i < this.subviews.length; i++) {
        var v = this.subviews[i];
        if (fields.indexOf(v.getId()) > -1) {
          v.showError(true);
        }
      }
    }

  });

});
