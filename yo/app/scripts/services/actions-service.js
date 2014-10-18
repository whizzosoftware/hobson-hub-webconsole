'use strict';

angular.module('hobsonApp').
    factory('ActionsService', ['$http', 'ApiService',
        function($http, ApiService) {

            var getActions = function() {
                return ApiService.topLevel().then(function(topLevel) {
                    console.debug('DevicesService.getDevices(): topLevel = ', topLevel);
                    return $http.get(topLevel.links.actions).then(function(response) {
                        return response.data;
                    });
                });
            };

            var getAction = function(action) {
                console.debug('getAction: ' + action.links.self);
                return $http.get(action.links.self).then(function(response) {
                    return response.data;
                });
            };

            return {
                getActions: getActions,
                getAction: getAction
            };
        }]);
