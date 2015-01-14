'use strict';

angular.module('hobsonApp').
  factory('VariablesService', ['$http', 'ApiService',
    function($http, ApiService) {

      var getGlobalVariables = function(link) {
        console.debug('VariablesService.getGlobalVariables(): link = ', link);
        return $http.get(link).then(function(response) {
          return response.data;
        });
      };

      return {
        getGlobalVariables: getGlobalVariables
      };
    }]);
