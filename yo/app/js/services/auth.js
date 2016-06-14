// Filename: services/auth.js
define([
  'jquery',
  'backbone',
  'cookies',
  'authFailHandler',
  'models/session'
], function($, Backbone, Cookies, authFailHandler, session) {
  return {

    redirectToLogin: function() {
      console.log('authService.redirectToLogin');
      Cookies.set('Token', null);
      this.setAuthFailHandler(false);
      $.ajax('/.well-known/openid-configuration', {
        context: this,
        type: 'GET',
        dataType: 'json',
        timeout: 5000,
        success: function (data, status, response) {
          console.log('successfully retrieved openid-configuration', data.authorization_endpoint, data.token_endpoint, data.grant_types_supported);
          if (data.authorization_endpoint && data.grant_types_supported && data.grant_types_supported.indexOf('authorization_code') > -1) {
            console.log('code grant supported');
            window.location.href = data.authorization_endpoint + '?response_type=code&client_id=hobson-webconsole' + (Backbone.history.location.href ? '&redirect_uri=' + encodeURIComponent(Backbone.history.location.href.split('?')[0]) : '');
          } else if (data.authorization_endpoint && data.grant_types_supported && data.grant_types_supported.indexOf('implicit') > -1) {
            console.log('password grant supported');
            var du = response.getResponseHeader('X-Default-User');
            console.log('found default user', du);
            window.location.href = data.authorization_endpoint + '?response_type=token&client_id=hobson-webconsole' + (Backbone.history.location.href ? '&redirect_uri=' + encodeURIComponent(Backbone.history.location.href) : '') + (du ? '&username=' + du : '');
          } else {
            console.log('Not sure what to do!');
          }
        },
        error: function (response, status, error) {
          console.log('error getting openid-configuration');
        }
      });
    },

    logout: function() {
      Cookies.set('Token', null);
      session.clearUser();
      window.location.reload();
    },

    setAuthFailHandler: function(b, authService) {
      console.log('setAuthFailHandler', b, authFailHandler);
      $.ajaxSetup({
        cache: false,
        statusCode: {
          401: b ? function() { authFailHandler(authService) } : null
        }
      });
    }

  };
});
