// Filename: views/app
define([
  'jquery',
  'underscore',
  'backbone',
  'sidr',
  'toastr',
  'models/session',
  'models/hub',
  'models/itemList',
  'models/propertyContainer',
  'models/plugin',
  'models/devices',
  'models/device',
  'models/deviceConfig',
  'models/task',
  'services/hub',
  'services/event',
  'views/navbar',
  'views/sidebar/sidebar',
  'views/dashboard/dashboard',
  'views/tasks/tasksTab',
  'views/tasks/taskEdit',
  'views/device/deviceState',
  'views/data/dataTab',
  'views/data/dataEdit',
  'views/data/dataViewer',
  'views/device/addDevice',
  'views/settings/settingsGeneral',
  'views/settings/settingsEmail',
  'views/settings/settingsPresence',
  'views/settings/settingsLog',
  'views/settings/settingsPlugins',
  'views/account/accountHubs',
  'views/account/accountProfile',
  'i18n!nls/strings',
  'text!templates/app.html'
], function ($, _, Backbone, Sidr, toastr, session, Hub, ItemList, Config, Plugin, Devices, Device, DeviceConfig, Task, HubService, EventService, HubNavbarView, SidebarView, DashboardView, TasksTabView, TaskEditView, DeviceStateView, DataTabView, DataEditView, DataViewer, DevicesAddView, HubSettingsGeneralView, HubSettingsEmailView, HubSettingsPresenceView, HubSettingsLogView, HubSettingsPluginsView, AccountHubsView, AccountProfileView, strings, appTemplate) {

  return Backbone.View.extend({

    name: 'hub',

    template: _.template(appTemplate),

    initialize: function () {
      $(document).find('#loading').remove();
      this.websocketEnabled = false;
    },

    render: function () {
      this.$el.append(this.template());

      if (session.showActivityLog()) {
        this.$el.find('#sidr').sidr({
          side: 'right',
          onOpen: this.onSidebarOpen,
          onClose: this.onSidebarClose
        });
      }

      if (session.hasSelectedHub() && window.WebSocket && session.getWebsocketUrl()) {
        this.connectWebsocket();
      }

      return this;
    },

    connectWebsocket: function() {
      this.websocket = new WebSocket(session.getWebsocketUrl());
      this.websocket.onmessage = EventService.handleEvent;
      this.websocketEnabled = true;

      var timer = setTimeout(function() {
        this.connectWebsocket();
      }.bind(this), 3000);

      this.websocket.onerror = function () {
        clearTimeout(timer);
        session.setWebsocketStatus(false);
        EventService.post('websocketStatus', false);
        return false;
      };
      this.websocket.onopen = function () {
        clearTimeout(timer);
        session.setWebsocketStatus(true);
        EventService.post('websocketStatus', false);
        return false;
      };
      this.websocket.onclose = function () {
        clearTimeout(timer);
        session.setWebsocketStatus(false);
        EventService.post('websocketStatus', false);
        return false;
      };
    },

    showDashboard: function () {
      this.renderContentView(new DashboardView({
        polling: !this.websocketEnabled
      }));
    },

    showDashboard2: function () {
      this.renderContentView(new Dashboard2View());
    },

    showData: function () {
      this.renderContentView(new DataTabView());
    },

    showDataEdit: function () {
      this.renderContentView(new DataEditView());
    },

    showDataViewer: function (dataStreamId, inr) {
      this.renderContentView(new DataViewer({dataStreamId: dataStreamId, inr: inr}));
    },

    showDevicesAdd: function () {
      this.renderContentView(new DevicesAddView(), true);
    },

    showTasks: function (userId, hubId) {
      this.renderContentView(new TasksTabView({userId: userId, hubId: hubId}));
    },

    showTaskEdit: function (id) {
      this.renderContentView(new TaskEditView({id: id}), true);
    },

    showHubSettingsGeneral: function () {
      this.renderContentView(new HubSettingsGeneralView(), true);
    },

    showHubSettingsEmail: function (userId, hubId) {
      this.renderContentView(new HubSettingsEmailView(), true);
    },

    showHubSettingsPresence: function (userId, hubId) {
      this.renderContentView(new HubSettingsPresenceView());
    },

    showHubSettingsLog: function () {
      this.renderContentView(new HubSettingsLogView());
    },

    showHubSettingsPlugins: function (query) {
      this.renderContentView(new HubSettingsPluginsView({query: query}), true);
    },

    showCloudlinkHubs: function () {
      this.renderContentView(new AccountHubsView());
    },

    showCloudlinkProfile: function () {
      this.renderContentView(new AccountProfileView());
    },

    showDeviceDetails: function (deviceUrl) {
      var device = new Device({url: deviceUrl + '?expand=telemetry'});
      device.fetch({
        context: this,
        success: function (model, response, options) {
          options.context.renderContentView(new DeviceDetailsView({model: model}));
        },
        error: function (model, response, options) {
          console.debug('nope!');
        }
      });
    },

    showDeviceState: function (deviceUrl) {
      var device = new Device({url: deviceUrl + '?expand=actionClasses.item,cclass,configuration,variables.item'});
      device.fetch({
        context: this,
        success: function (model, response, options) {
          this.renderContentView(new DeviceStateView({
            model: model,
            polling: !this.websocketEnabled
          }));
        }.bind(this),
        error: function (model, response, options) {
          console.debug('nope!');
        }
      });
    },

    renderContentView: function (view) {
      if (!this.navbarView) {
        this.navbarView = new HubNavbarView({
          user: this.user,
          hub: this.hub
        });
        this.$el.find('#navbar-container').html(this.navbarView.render().el);
      } else {
        this.navbarView.updateTabs();
      }

      if (this.contentView) {
        this.contentView.remove();
      }
      this.contentView = view;
      this.$el.find('#content-container').append(view.render().el);
    },

    onSidebarOpen: function () {
      this.sidebarView = new SidebarView();
      $('#sidr').html(this.sidebarView.render().el);
    },

    onSidebarClose: function () {
      var context = this;
      setTimeout(function () {
        context.sidebarView.remove()
        context.sidebarView = null;
      }, 200);
    }
  });

});
