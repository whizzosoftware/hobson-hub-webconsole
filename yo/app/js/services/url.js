// Filename: services/url.js
define([
  'jquery'
], function($) {
  return {
    hasAccessTokenOrCode: function(url) {
      return (url.indexOf('#access_token=') > -1 || url.indexOf('?code=') > -1);
    },

    extractAccessToken: function(url) {
      var ix = url.indexOf('#access_token=');
      if (ix > -1) {
        return url.substring(ix + 14);
      }
      return null;
    },

    removeAccessToken: function(url) {
      var ix = url.indexOf('#access_token=');
      if (ix > -1) {
        var ix2 = url.indexOf('?', ix);
        if (ix2 > -1) {
          return url.substring(0, ix) + url.substring(ix2);
        } else {
          return url.substring(0, ix);
        }
      }
      return url;
    },

    extractCode: function(url) {
      var ix = url.indexOf('?code=');
      if (ix > -1) {
        var ix2 = url.indexOf('#', ix);
        if (ix2 > -1) {
          return url.substring(ix + 6, ix2);
        } else {
          return url.substring(ix + 6);
        }
      }
      return null;
    },

    removeCode: function(url) {
      var ix = url.indexOf('?code=');
      if (ix > -1) {
        var ix2 = url.indexOf('#', ix);
        if (ix2 > -1) {
          return url.substring(0, ix) + url.substring(ix2);
        } else {
          return url.substring(0, ix);
        }
      } else {
        return url;
      }
    }
  };
});
