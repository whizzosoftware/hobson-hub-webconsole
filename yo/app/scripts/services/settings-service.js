'use strict';

angular.module('hobsonApp').
    factory('SettingsService', ['$http', 'ApiService', 'PollingService',
        function($http, ApiService, PollingService) {
            var getLogLevel = function() {
                return ApiService.topLevel().then(function(topLevel) {
                    return $http.get(topLevel.links['log-level']);
                });
            };

            var setLogLevel = function(logLevel) {
                return ApiService.topLevel().then(function(topLevel) {
                    return $http.put(topLevel.links['log-level'], angular.toJson({value: logLevel}));
                });
            };

            var shutdown = function() {
                return ApiService.topLevel().then(function(topLevel) {
                    return $http.post(topLevel.links.shutdown).then(function(response) {
                        var pollUrl = response.headers('location');
                        return PollingService.poll(function() {
                            var config = {timeout: 10000};
                            return $http.get(pollUrl, config).then(function() {
                                return null;
                            }, function() {
                                return true;
                            });
                        }, 100);
                    });
                });
            };

            return {
                getLogLevel: getLogLevel,
                setLogLevel: setLogLevel,
                shutdown: shutdown
            };
        }]);
