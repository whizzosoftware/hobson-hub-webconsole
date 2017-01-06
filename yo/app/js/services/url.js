// Filename: services/url.js
define([
  'jquery'
], function($) {
  return {
    hasAccessToken: function(url) {
      return (url.indexOf('#access_token=') > -1);
    },

    extractAccessToken: function(url) {
      var ix = url.indexOf('#access_token=');
      if (ix > -1) {
        var ix2 = url.indexOf('&', ix + 14);
        if (ix2 > -1) {
          return url.substring(ix + 14, ix2);
        } else {
          return url.substring(ix + 14);
        }
      }
      return null;
    },

    getQueryParam: function(url, name) {
      var ix = url.indexOf('?' + name + '=');
      if (ix == -1) {
        ix = url.indexOf('&' + name + '=');
      }
      if (ix > -1) {
        var ix2 = url.indexOf('&', ix + 1);
        if (ix2 == -1) {
          ix2 = url.indexOf('#', ix + 1);
        }
        if (ix2 > -1) {
          return url.substring(ix + name.length + 2, ix2);
        } else {
          return url.substring(ix + name.length + 2);
        }
      }
      return null;
    },

    removeQueryParams: function(url, names) {
      var u = url;
      for (var i=0; i < names.length; i++) {
        u = this.removeQueryParam(u, names[i]);
      }
      return u;
    },

    removeQueryParam: function(url, name) {
      var ix = url.indexOf('?' + name + '=');
      if (ix == -1) {
        ix = url.indexOf('#' + name + '=');
      }
      if (ix == -1) {
        ix = url.indexOf('&' + name + '=');
      }
      if (ix > -1) {
        var ix2 = url.indexOf('?', ix + 1);
        if (ix2 == -1) {
          ix2 = url.indexOf('#', ix + 1);
        }
        if (ix2 == -1) {
          ix2 = url.indexOf('&', ix + 1);
        }
        if (ix2 > -1) {
          return url.substring(0, ix) + url.substring(ix2);
        } else {
          return url.substring(0, ix);
        }
      }
      return url;
    }
  };
});
