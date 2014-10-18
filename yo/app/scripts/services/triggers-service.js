'use strict';

angular.module('hobsonApp').
    factory('TriggersService', ['$http', 'ApiService',
        function($http, ApiService) {

            var getTriggers = function(properties) {
                return ApiService.topLevel().then(function(topLevel) {
                    var url = topLevel.links.triggers;
                    if (properties) {
                        url += '?properties=true';
                    }
                    return $http.get(url).then(function(response) {
                        return response.data;
                    });
                });
            };

            var addTrigger = function(trigger) {
                return ApiService.topLevel().then(function(topLevel) {
                    var json = angular.toJson(trigger);
                    return $http.post(topLevel.links.triggers, json);
                });
            };

            var deleteTrigger = function(trigger) {
                return $http.delete(trigger.links.self);
            };

            return {
                getTriggers: getTriggers,
                addTrigger: addTrigger,
                deleteTrigger: deleteTrigger
            };
        }]);
