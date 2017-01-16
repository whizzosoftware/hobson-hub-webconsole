// Filename: services/hub.js
define([
  'jquery',
  'models/session',
  'models/actionClass',
  'models/dataStream',
  'models/hubs',
  'models/hub',
  'models/hubConfig',
  'models/itemList',
  'models/devicesData',
  'models/presenceEntity',
  'models/presenceLocation',
  'models/logEntry',
  'models/activityLogEntry',
  'models/plugin',
  'models/repository',
  'models/serialPort',
  'models/variable'
], function ($, session, ActionClass, DataStream, Hubs, Hub, HubConfig, ItemList, DevicesData, PresenceEntity, PresenceLocation, LogEntry, ActivityLogEntry, Plugin, Repository, SerialPort, Variable) {
  return {
    betaRepositoryUrl: 'http://www.hobson-automation.com/obr/beta/repository.xml',

    getHubActionClasses: function(success, error, id) {
      var url = session.getSelectedHub().get('actionClasses')['@id'] + '?expand=item&constraints=true';
      if (id) {
        url += '&id=' + id;
      }
      new ItemList(null, {model: ActionClass, url: url, sort: 'name'}).fetch({
        success: success,
        error: error
      });
    },

    invokeActionClass: function(ctx, url, properties, success, error) {
      return $.ajax(url, {
        context: ctx,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(properties),
        error: function(xhr, status, e) {
          error(e, xhr, {context: ctx});
        },
        success: function(data, status, xhr) {
          success(status, xhr, {context: ctx});
        }
      });
    },

    getHubWithId: function(ctx, url, success, error) {
      var hub = new Hub({url: url});
      hub.fetch({
        context: this,
        success: success,
        error: error
      });
    },

    retrieveHubWithId: function(hubId, hubsUrl, callback) {
      var hub = session.getSelectedHub();
      if (!hub || hub.get('id') !== hubId) {
        var hubs = new Hubs(hubsUrl);
        hubs.fetch({
          context: this,
          success: function (model, response, options) {
            // see if the requested hub is in the user's hub list
            var h = null;
            for (var i = 0; i < model.length; i++) {
              if (model.at(i).get('id') === hubId) {
                h = new Hub(model.at(i).toJSON());
                break;
              }
            }

            // if it is, fetch its details
            if (h != null) {
              h.fetch(callback);
            } else {
              callback.error(null, null, null);
            }
          },
          error: function (model, response, options) {
            callback.error(null, null, null);
          }
        });
      } else {
        hub.fetch(callback);
      }
    },

    getHubConfiguration: function(ctx, success, error) {
      var url = session.getSelectedHub().get('configuration')['@id'];
      new HubConfig({url: url}).fetch({
        context: ctx,
        success: success,
        error: error
      });
    },

    setHubAwayMode: function(away, success, error) {
      var url = session.getSelectedHub().get('configuration')['@id'];
      return $.ajax(url, {
        type: 'PATCH',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({values: {away: away}}),
        error: function(xhr, status, e) {
          error(e, xhr);
        },
        success: function(data, status, xhr) {
          success(status, xhr);
        }
      });
    },

    getHubSerialPorts: function(ctx, success, error) {
      var url = session.getSelectedHub().get('serialPorts')['@id'];
      new ItemList(null, {url: url, model: SerialPort}).fetch({
        context: ctx,
        success: success,
        error: error
      });
    },

    getGlobalVariables: function(ctx, success, error) {
      var url = session.getSelectedHub().get('globalVariables')['@id'];
      new ItemList(null, {url: url + '?expand=item', model: Variable}).fetch({
        context: ctx,
        success: success,
        error: error
      });
    },

    getDevicesData: function(ctx, headers, success, error) {
      var hub = session.getSelectedHub();
      var url = hub ? hub.get('@id') + '?expand=devices.item.preferredVariable,presenceEntities.item.location' : null;
      if (hub && url) {
        var items = new DevicesData({url: url});
        items.fetch({
          context: ctx,
          headers: headers,
          success: function (model, response, options) {
            // sort the device list alphabetically
            model.get('devices').models.sort(function (a, b) {
              var x = a.get('name');
              var y = b.get('name');
              return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            success(model, response, options);
          },
          error: error
        });
      } else {
        error(null, null, {context: ctx});
      }
    },

    getActivityLog: function(ctx, success, error) {
      var hub = session.getSelectedHub();
      if (hub) {
        var url = hub.get('links') ? hub.get('links').activityLog : null;
        if (url) {
          this.activities = new ItemList(null, {model: ActivityLogEntry, url: url});
          this.activities.fetch({
            context: ctx,
            success: success,
            error: error
          });
          return;
        }
      }
      success(null, null, {context: ctx});
    },

    getLogEntries: function(ctx, success, error) {
      var hub = session.getSelectedHub();
      var url = hub.get('log')['@id'];
      if (hub && url) {
        var logEntries = new ItemList(null, {model: LogEntry, url: url});
        logEntries.fetch({
          context: ctx,
          success: success,
          error: error
        });
      } else {
        error(null, null, {context: ctx});
      }
    },

    getLocations: function(ctx, success, error) {
      var hub = session.getSelectedHub();
      if (hub) {
        var url = hub.get('presenceLocations')['@id'] + '?expand=item';
        if (url) {
          var locations = new ItemList(null, {model: PresenceLocation, url: url, sort: 'name'});
          locations.fetch({
            context: ctx,
            success: success,
            error: error
          });
          return;
        }
      }
      success(null, null, {context: ctx});
    },

    getRepositories: function(ctx, success, error) {
      var hub = session.getSelectedHub();
      var url = hub.get('repositories')['@id'];
      if (hub && url) {
        var items = new ItemList(null, {model: Repository, url: url});
        items.fetch({
          context: ctx,
          success: success,
          error: error
        });
      } else {
        error(null, null, {context: ctx});
      }
    },

    createNewPresenceLocation: function() {
      var hub = session.getSelectedHub();
      var url = hub.get('presenceLocations')['@id'];
      if (hub && url) {
        return new PresenceLocation({url: url});
      } else {
        return null;
      }
    },

    deletePresenceLocation: function(context, url) {
      return $.ajax(url, {
        context: context,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
    },

    createPresenceEntitiesModel: function() {
      var hub = session.getSelectedHub();
      var url = hub.get('presenceEntities')['@id'] + '?expand=item';
      if (hub && url) {
        return new ItemList(null, {model: PresenceEntity, url: url, sort: 'name'});
      } else {
        return null;
      }
    },

    getPresenceEntities: function(ctx, success, error) {
      var hub = session.getSelectedHub();
      if (hub) {
        var url = hub.get('presenceEntities')['@id'] + '?expand=item';
        if (url) {
          var entities = new ItemList(null, {model: PresenceEntity, url: url, sort: 'name'});
          entities.fetch({
            context: ctx,
            success: success,
            error: error
          });
          return;
        }
      }
      success(null, null, {context: ctx});
    },

    createNewPresenceEntity: function() {
      var hub = session.getSelectedHub();
      var url = hub.get('presenceEntities')['@id'];
      if (hub && url) {
        return new PresenceEntity({url: url});
      } else {
        return null;
      }
    },

    deletePresenceEntity: function(context, url) {
      return $.ajax(url, {
        context: context,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
    },

    sendTestEmail: function(ctx, userId, hubId, model) {
      var hub = session.getSelectedHub();
      var url = hub.get('links').sendTestEmail;
      var data = model.toJSON();
      return $.ajax(url, {
        context: ctx,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json'
      });
    },

    setPassword: function(ctx, userId, hubId, password) {
      var hub = session.getSelectedHub();
      var url = hub.get('links').password;
      var data = {currentPassword: 'local', newPassword: password};
      return $.ajax(url, {
        context: ctx,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json'
      });
    },

    getPlugins: function(ctx, url, success, error) {
      var plugins = new ItemList(null, {model: Plugin, url: url + '?expand=item.actionClasses.item'});
      plugins.fetch({
        context: ctx,
        success: success,
        error: error
      });
    },

    installPlugin: function(ctx, url) {
      return $.ajax(url, {
        type: 'POST',
        timeout: 5000
      });
    },

    enableBetaPlugins: function(ctx, userId, hubId) {
      var hub = session.getSelectedHub();
      var url = hub.get('repositories')['@id'];

      var req = {
        uri: this.betaRepositoryUrl
      };

      return $.ajax(url, {
        context: ctx,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(req),
        dataType: 'json'
      });
    },

    disableBetaPlugins: function(ctx) {
      var hub = session.getSelectedHub();
      var url = hub.get('repositories')['@id'];
      if (hub && url) {
        return $.ajax(url + '/' + encodeURIComponent(this.betaRepositoryUrl), {
          context: ctx,
          type: 'DELETE'
        });
      }
    },

    shutdown: function(ctx, url) {
      return $.ajax(url, {
        context: ctx,
        type: 'POST'
      });
    },

    getDataStreams: function(ctx, success, error) {
      var hub = session.getSelectedHub();
      if (hub.get('dataStreams')) {
        var dataStreams = new ItemList(
          null,
          {url: hub.get('dataStreams')['@id'] + '?expand=item', model: DataStream}
        );
        dataStreams.fetch({
          context: ctx,
          success: function(model, response, options) {
            success(ctx, model);
          },
          error: function(model, response, options) {
            error('Error getting data stream list');
          }
        });
      }
    },

    getDataStream: function(ctx, url, success, error) {
      var dataStream = new DataStream({url: url});
      dataStream.fetch({
        context: ctx,
        success: function(model, response, options) {
          success(ctx, model);
        },
        error: function(model, response, options) {
          error('Error getting data stream');
        }
      })
    },

    getDataStreamData: function(ctx, url, inr, success, error) {
      if (inr) {
        url += '?inr=' + inr;
      }
      var dataStream = new DataStream({url: url});
      dataStream.fetch({
        context: ctx,
        success: function(model, response, options) {
          success(ctx, model);
        },
        error: function(model, response, options) {
          error('Error getting data stream');
        }
      })
    },

    addDataStream: function(ctx, data, success, error) {
      var hub = session.getSelectedHub();
      if (hub.get('dataStreams')) {
        var dataStream = new DataStream({url: hub.get('dataStreams')['@id']});
        dataStream.set('name', data.name);
        dataStream.set('fields', data.fields);
        dataStream.save(null, {
          success: success,
          error: error
        });
      } else {
        error('Creating data streams is not supported');
      }
    },

    deleteDataStream: function(ctx, url, success, error) {
      return $.ajax(url, {
        context: ctx,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json',
        success: success,
        error: error
      });
    }

  };
});
