// Filename: services/error.js
define([
  'jquery'
], function($) {
  return {
    
    createErrorHtml: function(response, strings) {
      var html;
      if (response && response.responseJSON && response.responseJSON.errors) {
        if (response.responseJSON.errors.length < 2) {
          html = response.responseJSON.errors[0].message;
        } else {
          html = strings.FollowingErrorsOccurred + '<br/><ul>';
          for (var i=0; i < response.responseJSON.errors.length; i++) {
            html += '<li>' + response.responseJSON.errors[i].message + '</li>';
          }
          html += '</ul>';
        }
        return html;
      } else {
        return strings.ErrorOccurred;
      }
    }

  };
});
