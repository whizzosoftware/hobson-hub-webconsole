// Filename: views/dashboard
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/hub',
  'services/device',
  'services/event',
  'models/itemList',
  'models/session',
  'views/dashboard/devicesSection',
  'views/dashboard/presenceEntitiesSection',
  'i18n!nls/strings',
  'text!templates/dashboard/dashboard.html'
], function ($, _, Backbone, toastr, HubService, DeviceService, EventService, ItemList, Session, DevicesSection, PresenceEntitiesSection, strings, template) {

  return Backbone.View.extend({
    tagName: 'div',

    template: _.template(template),

    events: {
      'deviceButtonClick': 'onDeviceButtonClick'
    },

    initialize: function (options) {
      this.subviews = [];
      _.bind(this.renderSections, this);

      // listen for devVarsUpdate events and pass along if applicable
      this.subscription = this.onDeviceAvailability.bind(this);
      this.subscription2 = this.onDeviceUnavailability.bind(this);
      this.subscription3 = this.onDeviceVariableUpdate.bind(this);
      EventService.subscribe('deviceAvailable', this.subscription);
      EventService.subscribe('deviceUnavailable', this.subscription2);
      EventService.subscribe('devVarsUpdate', this.subscription3);
    },

    onDeviceAvailability: function(event) {
      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].onDeviceAvailability(event);
      }
    },

    onDeviceUnavailability: function(event) {
      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].onDeviceUnavailability(event);
      }
    },

    onDeviceVariableUpdate: function(event) {
      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].onDeviceVariableUpdate(event);
      }
    },

    remove: function () {
      EventService.unsubscribe(this.subscription);
      EventService.unsubscribe(this.subscription2);
      EventService.unsubscribe(this.subscription3);

      for (var i = 0; i < this.subviews.length; i++) {
        this.subviews[i].remove();
      }

      this.clearRefreshInterval();

      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      $('#toolbar').css('display', 'block');

      // create dashboard shell
      this.$el.html(this.template({strings: strings}));

      // create tile groups
      this.addSection(new DevicesSection({
        name: strings.Cameras,
        filter: function (d) {
          return d.get('type') === 'CAMERA'
        }
      }));
      this.addSection(new PresenceEntitiesSection({
        name: strings.Presence
      }));
      this.addSection(new DevicesSection({
        name: strings.Sensors,
        filter: function (d) {
          return d.get('type') === 'SENSOR'
        }
      }));
      this.addSection(new DevicesSection({
        name: strings.Miscellaneous,
        filter: function (d) {
          return (d.get('type') !== 'CAMERA' && d.get('type') !== 'LIGHTBULB' && d.get('type') !== 'SENSOR' && d.get('type') !== 'SWITCH' )
        }
      }));
      this.addSection(new DevicesSection({
        name: strings.LightsAndSwitches,
        filter: function (d) {
          return d.get('type') === 'LIGHTBULB' || d.get('type') === 'SWITCH'
        }
      }));

      // render initial device tiles
      this.refresh();

      return this;
    },

    addSection: function (section) {
      this.$el.find('#tileGroups').append(section.render().el);
      this.subviews.push(section);
    },

    refresh: function () {
      // build request headers
      var headers = {};

      // fetch the device list
      HubService.getDashboardData(
        this,
        headers,
        function (model, response, options) {
          options.context.etag = options.xhr.getResponseHeader('ETag');
          if (options.xhr.status !== 304) {
            options.context.renderSections(model);
          } else {
            options.context.renderSections(null);
          }
        },
        function (model, response, options) {
          toastr.error(strings.DeviceListRetrieveError);
        }
      );
    },

    renderSections: function (newModel) {
      var hadContent = false;

      // render all subviews
      for (var ix in this.subviews) {
        var section = this.subviews[ix];
        var m = null;

        if (newModel) {
          if (section.type && section.type === 'device') {
            m = newModel.get('devices');
          } else if (section.type && section.type === 'presence') {
            m = newModel.get('presenceEntities');
          }
        }

        if (m) {
          section.updateModel(m);
          hadContent = hadContent || section.hasContent();
        }

        section.render();
      }

      // hide the loading indicator
      this.$el.find('#loading').css('display', 'none');

      // hide/show the "no device" notice as appropriate
      if (!hadContent && newModel) {
        this.$el.find('.notice').css('display', 'block');
      } else {
        this.$el.find('.notice').css('display', 'none');
      }
    },

    clearRefreshInterval: function () {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },

    onDeviceButtonClick: function (event, device) {
      Backbone.history.navigate('#device/' + encodeURIComponent(device.get('@id')) + '/state', {trigger: true});
    }
  });

});
