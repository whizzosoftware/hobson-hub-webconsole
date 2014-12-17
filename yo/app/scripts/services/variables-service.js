'use strict';

angular.module('hobsonApp').
  factory('VariablesService', ['$http', 'ApiService',
    function($http, ApiService) {

      var getGlobalVariables = function() {
        return ApiService.topLevel().then(function(topLevel) {
          console.debug('VariablesService.getGlobalVariables(): topLevel = ', topLevel);
          return $http.get(topLevel.links.globalVariables).then(function(response) {
            return response.data;
          });
        });
      };

      return {
        getGlobalVariables: getGlobalVariables
      };
    }]);
