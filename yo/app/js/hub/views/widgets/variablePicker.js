// Filename: views/widgets/variablePicker.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'views/widgets/baseWidget',
  'services/device',
  'views/collection/variables',
  'i18n!nls/strings',
  'text!templates/widgets/variablePicker.html'
], function ($, _, Backbone, toastr, BaseWidget, DeviceService, VariablesView, strings, template) {

  return BaseWidget.extend({
    template: _.template(template),

    className: 'device-picker',

    events: {
      'variableClicked': 'onClickVariable'
    },

    initialize: function (options) {
      this.subviews = [];
      this.single = options ? options.single : null;
      if (options && options.model) {
        this.model = options.model;
      } else {
        this.model = {
          value: [],
          constraints: {
            required: false
          }
        };
      }
    },

    remove: function () {
      if (this.variablesView) {
        this.variablesView.remove();
      }
      BaseWidget.prototype.remove.call(this);
    },

    render: function () {
      this.$el.append(
        this.template({
          strings: strings,
          property: this.model,
          required: this.model.constraints && this.model.constraints.required ? this.model.constraints.required : false
        })
      );

      if (!this.model.device) {
        this.reset();
      }

      return this;
    },

    reset: function () {
      this.$el.find('#variablesList').html('<p>' + strings.NoVariablesAvailable + '</p>');
    },

    setDevice: function (device) {
      if (device) {
        this.model.device = device.toJSON();
        this.$el.find('#variablesList').html('<img src="img/loading.gif" />');
        this.model.value = [];
        DeviceService.getDeviceVariables(this, device.get('variables')['@id'], function (model, response, options) {
          if (options.context.variablesView) {
            options.context.variablesView.remove();
          }
          options.context.variablesView = new VariablesView({
            variables: model,
            value: options.context.model.value
          });
          options.context.$el.find('#variablesList').html(options.context.variablesView.render().el);
        }, function (model, response, error) {
          toastr.error('Error retrieving variables');
        });
      } else {
        this.reset();
      }
    },

    onClickVariable: function (event, options) {
      var variableId = options.variable.get('@id');
      var deselection = this.isVariableSelected(variableId);

      // change the property value
      if (deselection) {
        for (var i = 0; i < this.model.value.length; i++) {
          if (this.model.value[i]['@id'] === variableId) {
            this.model.value.splice(i, 1);
            break;
          }
        }
      } else {
        if (this.single) {
          this.model.value.splice(0, this.model.value.length);
        }
        this.model.value.push(options.variable.toJSON());
      }

      // re-render the view
      this.variablesView.render();

      this.$el.trigger(deselection ? 'variableDeselected' : 'variableSelected', options.variable);
    },

    isVariableSelected: function (variableId) {
      for (var i = 0; i < this.model.value.length; i++) {
        if (this.model.value[i]['@id'] === variableId) {
          return true;
        }
      }
      return false;
    },

    getValue: function () {
      return this.$el.find('input#' + this.getSafeId()).val();
    },

    showError: function (showError) {
      BaseWidget.prototype.showError.call(this, showError);
      if (showError) {
        this.$el.find('#variablesList ul').addClass('error');
      } else {
        this.$el.find('#variablesList ul').removeClass('error');
      }
    }

  });

});
