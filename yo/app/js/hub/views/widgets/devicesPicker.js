// Filename: views/widgets/devicesPicker.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'models/session',
  'models/itemList',
  'models/device',
  'views/widgets/baseWidget',
  'views/collection/devices',
  'i18n!nls/strings',
  'text!templates/widgets/devicesPicker.html'
], function ($, _, Backbone, toastr, session, ItemList, Device, BaseWidget, DevicesView, strings, template) {

  return BaseWidget.extend({
    template: _.template(template),

    className: 'device-picker',

    events: {
      'deviceClicked': 'onClickDevice'
    },

    initialize: function (options) {
      this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
      this.deviceType = this.model && this.model.constraints ? this.model.constraints.deviceType : null;
      this.single = options.single;
      this.showDescription = options.showDescription;
      this.subviews = [];
      this.value = [];
      if (options.value && Array.isArray(options.value)) {
        for (var i = 0; i < options.value.length; i++) {
          this.value.push(options.value[i]['@id']);
        }
      } else if (options.value) {
        this.value.push(options.value['@id']);
      }
    },

    remove: function () {
      for (var ix in this.subviews) {
        this.subviews[ix].remove();
      }
      this.subviews.length = 0;
      BaseWidget.prototype.remove.call(this);
    },

    render: function () {
      this.$el.append(
        this.template({
          strings: strings,
          property: this.model,
          required: this.required,
          showDescription: (!(!this.showDescription && this.showDescription != null))
        })
      );

      var url = session.getSelectedHubDevicesUrl() + '?expand=item';
      if (this.model && this.model.constraints && this.model.constraints.deviceVariable) {
        url += '&var=' + this.model.constraints.deviceVariable;
      }

      var devices = new ItemList(null, {model: Device, url: url, sort: 'name'});
      devices.fetch({
        context: this,
        success: function (model, response, options) {
          if (model.length > 0) {
            options.context.devicesView = new DevicesView({
              devices: model,
              value: options.context.value,
              deviceType: options.context.deviceType
            });
            options.context.$el.find('#deviceList').html(options.context.devicesView.render().el);
            options.context.subviews.push(options.context.devicesView);
            options.context.setDeviceCount(options.context.value.length);
          } else {
            options.context.$el.find('#deviceList').html('<p>' + strings.NoDevicesAvailable + '</p>');
          }
        },
        error: function (model, response, options) {
          toastr.error(strings.DeviceListRetrieveError);
        }
      });

      return this;
    },

    setDeviceCount: function (count) {
      if (count === 0) {
        this.$el.find('#deviceCount').html(this.single ? strings.NoDevicesSelectedSingle : strings.NoDevicesSelectedMultiple);
      } else if (count === 1) {
        this.$el.find('#deviceCount').html('1 ' + strings.DeviceSelected);
      } else if (count > 1) {
        this.$el.find('#deviceCount').html(count + ' ' + strings.DevicesSelected);
      }
    },

    onClickDevice: function (event, options) {
      var deviceId = options.device.get('@id');
      var selected = options.selected;

      // change the property value
      if (selected) {
        if (this.value.indexOf(deviceId) == -1) {
          if (this.single) {
            this.value.splice(0, this.value.length);
          }
          this.value.push(options.device);
        }
      } else {
        for (var i = 0; i < this.value.length; i++) {
          if (this.value[i].get('@id') === deviceId) {
            this.value.splice(i, 1);
            break;
          }
        }
      }

      // update device count selection text
      this.setDeviceCount(this.value.length);

      // set the device selector status
      this.devicesView.setSelectedDevices(this.value);

      // inform listeners of the change
      this.$el.trigger('devicesSelectionChange', this.value);
    },

    isDeviceSelected: function (deviceId) {
      for (var i = 0; i < this.value.length; i++) {
        if (this.value[i]['@id'] === deviceId) {
          return true;
        }
      }
      return false;
    },

    getValue: function () {
      if (this.single) {
        return this.value.length > 0 ? {'@id': this.value[0].get('@id')} : null;
      } else {
        var result = [];
        for (var i = 0; i < this.value.length; i++) {
          result.push({
            '@id': this.value[i].get('@id')
          });
        }
        return result;
      }
    },

    showError: function (showError) {
      BaseWidget.prototype.showError.call(this, showError);
      if (showError) {
        this.$el.find('#deviceList ul').addClass('error');
      } else {
        this.$el.find('#deviceList ul').removeClass('error');
      }
    }

  });

});
