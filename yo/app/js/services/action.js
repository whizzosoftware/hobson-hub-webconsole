// Filename: services/action.js
define([
  'jquery',
  'underscore',
  'models/session',
  'models/itemList',
  'models/actionClass'
], function ($, _, session, ItemList, ActionClass) {
  return {

    getActionClasses: function(url, success, error) {
      new ItemList(null, {model: ActionClass, url: url}).fetch({
        success: success,
        error: error
      });
    },

    getActionClass: function(url, success, error) {
      new ActionClass({url: url}).fetch({
        success: success,
        error: error
      });
    },

    executeAction: function(url, properties, success, error) {
      var data = properties ? {values: properties} : null;
      return $.ajax(url, {
        type: 'POST',
        dataType: 'json',
        data: data ? JSON.stringify(data) : null,
        error: function(xhr, status, e) {
          if (xhr.status == 201) {
            success(null, xhr);
          } else {
            error(e, xhr);
          }
        },
        success: function(data, status, xhr) {
          console.log('success');
          success(status, xhr);
        }
      });
    },

    getJobStatus: function(url, success, error) {
      return $.ajax(url, {
        type: 'GET',
        success: function(data, status, xhr) {
          success(data, xhr);
        }, 
        error: function(xhr, status, e) {
          error(e, xhr);
        }
      });
    },

    stopJob: function(url, success, error) {
      return $.ajax(url, {
        type: 'DELETE',
        success: function(data, status, xhr) {
          success();
        },
        error: function(xhr, status, e) {
          error();
        }
      });
    }

  };
});
