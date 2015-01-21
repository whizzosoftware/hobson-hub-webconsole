'use strict';

angular.module('hobsonApp').
  factory('VariablesService', ['$http',
    function($http) {

      var getGlobalVariables = function(link) {
        return $http.get(link).then(function(response) {
          return response.data;
        });
      };

      return {
        getGlobalVariables: getGlobalVariables
      };
    }]);
