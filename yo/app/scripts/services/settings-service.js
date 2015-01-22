'use strict';

angular.module('hobsonApp').
    factory('SettingsService', ['$http', 'ApiService', 'PollingService',
        function($http, ApiService, PollingService) {
            var getConfiguration = function(uri) {
              return $http.get(uri);
            };

            var setConfiguration = function(uri, config) {
              console.debug('setConfiguration: ', config);
              return $http.put(uri, angular.toJson(config));
            };

            var getLog = function() {
                return ApiService.topLevel().then(function(topLevel) {
                    return $http.get(topLevel.links['log']);
                });
            };

            var shutdown = function(uri) {
              return $http.post(uri).then(function(response) {
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
            };

            return {
                getConfiguration: getConfiguration,
                setConfiguration: setConfiguration,
                getLog: getLog,
                shutdown: shutdown
            };
        }]);
