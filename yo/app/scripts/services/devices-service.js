'use strict';

angular.module('hobsonApp').
    factory('DevicesService', ['$http', 'ApiService', 'PollingService',
        function($http, ApiService, PollingService) {

            var getDevices = function(link) {
                return $http.get(link + '?details=true').then(function(response) {
                    return response.data;
                });
            };

            var getDevicesForPlugin = function(plugin) {
                return $http.get(plugin.links.devices).then(function(response) {
                    return response.data;
                });
            };

            var getDevice = function(link) {
                return $http.get(link + '?variables=true').then(function(response) {
                    return response.data;
                });
            };

            var setDeviceVariable = function(link, val) {
                var entity = '{"value": ' + val + '}';
                return $http.put(link, entity).then(function(response) {
                    // poll for status
                    return PollingService.poll(function() {
                        var config = {headers: {}};
                        if (response.headers('ETag')) {
                          config.headers['If-None-Match'] = response.headers('ETag');
                        }
                        // make the polling HTTP call
                        return $http.get(response.headers('Location'), config).then(function(data) {
                            // if we get back a 200, then check the value
                            if (data.status === 200) {
                                return (data.data.value === val);
                                // if we get back a 302, then the variable hasn't changed since we set it
                            } else if (data.status === 302) {
                                return null;
                                // any other status code is an error
                            } else {
                                return false;
                            }
                        });
                    }, 5);
                });
            };

            var getDeviceTelemetry = function(link) {
              return $http.get(link).then(function(response) {
                  return response.data;
              });
            };

            var setDeviceName = function(link, val) {
                return $http.put(link, '{"name":{"value":"' + val + '"}}');
            };

            var getDeviceConfig = function(link) {
                return $http.get(link).then(function(response) {
                    return response.data;
                });
            };

            var getDeviceVariableEvents = function(link) {
                return $http.get(link).then(function(response) {
                    return response.data;
                });
            };

            var setDeviceConfig = function(link, val) {
                var json = JSON.stringify(val);
                return $http.put(link, json);
            };

            var enableDeviceTelemetry = function(link, val) {
                var json = JSON.stringify({value: val});
                return $http.put(link, json);
            };

            return {
                getDevice: getDevice,
                getDevices: getDevices,
                getDevicesForPlugin: getDevicesForPlugin,
                getDeviceVariableEvents: getDeviceVariableEvents,
                setDeviceVariable: setDeviceVariable,
                setDeviceName: setDeviceName,
                getDeviceConfig: getDeviceConfig,
                setDeviceConfig: setDeviceConfig,
                getDeviceTelemetry: getDeviceTelemetry,
                enableDeviceTelemetry: enableDeviceTelemetry
            };
        }]);
