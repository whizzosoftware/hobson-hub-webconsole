// Filename: services/event.js
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  var eventService = {
    vent: _.extend({}, Backbone.Events),

    initialize: function(options) {
      console.log('new event service');
    },

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
      } else if (e.id == 'hubConfigurationUpdate') {
        eventService.post(e.id, {
          id: e['id'],
          configuration: e['configuration']
        });
      }
    },

    post: function(name, event) {
      this.vent.trigger(name, event);
    }
  };

  return eventService;
});
