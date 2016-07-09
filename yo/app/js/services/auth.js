// Filename: services/auth.js
define([
  'jquery',
  'backbone',
  'cookies',
  'authFailHandler',
  'services/url',
  'models/session'
], function($, Backbone, Cookies, authFailHandler, UrlService, session) {
  return {

    redirectToLogin: function(error, errorDescription) {
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
          if (data.authorization_endpoint && data.grant_types_supported && data.grant_types_supported.indexOf('implicit') > -1) {
            console.log('implicit grant supported');
            var du = response.getResponseHeader('X-Default-User');
            console.log('found default user', du);
            var redirUri = Backbone.history.location.href;
            if (redirUri) {
              redirUri = UrlService.removeQueryParam(redirUri, 'error');
              redirUri = UrlService.removeQueryParam(redirUri, 'error_description');
            }
            var uri = data.authorization_endpoint + '?response_type=token&client_id=hobson-webconsole' + (redirUri ? '&redirect_uri=' + encodeURIComponent(redirUri) : '') + (du ? '&username=' + du : '');
            // add error and error description (if present) to redirect URI so web page can display them
            if (error) {
              uri += '&error=' + error;
            }
            if (errorDescription) {
              uri += '&error_description=' + errorDescription;
            }
            window.location.href = uri;
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
