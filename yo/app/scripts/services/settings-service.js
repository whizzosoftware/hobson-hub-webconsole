'use strict';

angular.module('hobsonApp').
    factory('SettingsService', ['$http', 'ApiService', 'PollingService',
        function($http, ApiService, PollingService) {
            var getConfiguration = function() {
                return ApiService.topLevel().then(function(topLevel) {
                    return $http.get(topLevel.links['configuration']);
                });
            };

            var setConfiguration = function(config) {
              console.debug('setConfiguration: ', config);
              return ApiService.topLevel().then(function(topLevel) {
                    return $http.put(topLevel.links['configuration'], angular.toJson(config));
                });
            };

            var getLog = function() {
                return ApiService.topLevel().then(function(topLevel) {
                    return $http.get(topLevel.links['log']);
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
                getConfiguration: getConfiguration,
                setConfiguration: setConfiguration,
                getLog: getLog,
                shutdown: shutdown
            };
        }]);
