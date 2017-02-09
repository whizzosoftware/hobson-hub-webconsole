// Filename: services/event.js
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  var eventService = {
    vent: _.extend({}, Backbone.Events),

    subscribe: function(name, callback) {
      this.vent.on(name, callback);
    },

    unsubscribe: function(callback) {
      this.vent.off(null, callback);
    },

    handleEvent: function(event) {
      var e = JSON.parse(event.data);

      if (e.id == 'devVarsUpdate') {
        for (var i = 0; i < e.properties['updates'].length; i++) {
          var u = e.properties['updates'][i];
          eventService.post(e.id, {
            id: u['id'],
            name: u['name'],
            value: u['newValue']
          });
        }
      } else if (e.id == 'taskExecute') {
        eventService.post(e.id, {
          id: e['id'],
          name: e['properties']['name']
        });
      } else if (e.id == 'taskUpdated') {
        var p = e.properties;
        eventService.post(e.id, {
          id: p['id'],
          name: p['name'],
          description: p['description'],
          enabled: p['enabled'],
          properties: p['taskProperties']
        });
      } else if (e.id == 'taskDeleted') {
        eventService.post(e.id, {
          id: e.properties['id']
        });
      } else if (e.id == 'hubConfigurationUpdate') {
        eventService.post(e.id, {
          id: e['id'],
          configuration: e['configuration']
        });
      } else if (e.id == 'deviceAvailable' || e.id == 'deviceUnavailable' || e.id == 'deviceStarted') {
        eventService.post(e.id, {
          id: e.properties['id']
        });
      } else if (e.id == 'pluginStatusChange') {
        eventService.post(e.id, {
          id: e.properties['id'],
          pluginId: e.properties['pluginId'],
          status: e.properties['status']
        });
      }
    },

    post: function(name, event) {
      this.vent.trigger(name, event);
    }
  };

  return eventService;
});
