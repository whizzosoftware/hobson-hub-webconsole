'use strict';

angular.module('hobsonApp').
    factory('PluginsService', ['$http', '$rootScope', 'ApiService', 'PollingService',
        function($http, $rootScope, ApiService, PollingService) {

            var numUpdatesAvailable = 0,
                failedArray = [],
                notConfiguredArray = [];

            /**
             * Get a list of plugins.
             *
             * @param pluginsUri the URI to obtain the list of plugins
             * @param remote boolean indicating whether remote plugins should be included in addition to local ones
             * @param details boolean indicating whether plugin details should be returned
             */
            var getPlugins = function(pluginsUri, remote, details) {
                console.debug('getPlugins: ', pluginsUri);

                remote = typeof remote !== 'undefined' ? remote : false;
                details = typeof remote !== 'undefined' ? details : false;

                return $http.get(pluginsUri + '?remote=' + remote + '&details=' + details).then(function(response) {
                    numUpdatesAvailable = 0;
                    notConfiguredArray = [];
                    failedArray = [];
                    console.debug('PluginsService.getPlugins(): response.data = ', response.data);
                    response.data.forEach(function(plugin) {
                        if (plugin.links.update) {
                            numUpdatesAvailable++;
                        }
                        if (plugin.status.status === 'FAILED') {
                            failedArray.push(plugin);
                        } else if (plugin.status.status === 'NOT_CONFIGURED') {
                            notConfiguredArray.push(plugin);
                        }
                    });
                    $rootScope.$broadcast('NUM_PLUGINS', numUpdatesAvailable);
                    return response.data;
                });
            };

            var getPluginConfiguration = function(plugin) {
                return $http.get(plugin.links.configuration).then(function(response) {
                    return response.data;
                });
            };

            var setPluginConfiguration = function(plugin, config) {
                console.debug('setPluginConfiguration: ', JSON.stringify(config));
                return $http.put(plugin.links.configuration, JSON.stringify(config));
            };

            var install = function(plugin) {
                console.debug('PluginService.install(): plugin = ', plugin);
                var targetVersion = plugin.latestVersion;
                return $http.post(plugin.links.install).then(function(response) {
                    var pollUrl = response.headers('location');
                    // poll for status
                    return PollingService.poll(function() {
                        // make the polling HTTP call
                        return $http.get(pollUrl).then(function(data) {
                            if (data.status === 200) {
                                if (data.data.currentVersion === targetVersion) {
                                    return true;
                                } else {
                                    return null;
                                }
                            } else {
                                return false;
                            }
                        });
                    }, 5);
                });
            };

            var reload = function(plugin) {
                return $http.post(plugin.links.reload);
            };

            var update = function(plugin) {
                console.debug('PluginService.update(): plugin = ', plugin);
                var targetVersion = plugin.latestVersion;
                return $http.post(plugin.links.update).then(function(response) {
                    var pollUrl = response.headers('location');
                    // poll for status
                    return PollingService.poll(function() {
                        // make the polling HTTP call
                        return $http.get(pollUrl).then(function(data) {
                            console.debug(data.data.currentVersion + ' vs. ' + targetVersion);
                            if (data.status === 200) {
                                if (data.data.currentVersion === targetVersion) {
                                    return true;
                                } else {
                                    return null;
                                }
                            } else {
                                return false;
                            }
                        });
                    }, 5);
                });
            };

            var numUpdates = function() {
                return numUpdatesAvailable;
            };

            var notConfigured = function() {
                return notConfiguredArray;
            };

            var failed = function() {
                return failedArray;
            };

            return {
                getPlugins: getPlugins,
                getPluginConfiguration: getPluginConfiguration,
                setPluginConfiguration: setPluginConfiguration,
                numUpdates: numUpdates,
                notConfigured: notConfigured,
                failed: failed,
                install: install,
                reload: reload,
                update: update
            };
        }]);
