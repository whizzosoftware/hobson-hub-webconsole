'use strict';

angular.module('hobsonApp').
    controller('PluginsController', ['$scope', '$q', '$interval', 'AppData', 'ApiService', 'PluginsService', 'DialogContextService', '$modal', 'toastr',
    function($scope, $q, $interval, AppData, ApiService, PluginsService, DialogContextService, $modal, toastr) {
        var refreshInterval;

        $scope.state = {
          includeFrameworkPlugins: false
        };
        $scope.updates = {};

        var setPlugins = function(plugins, includeRemote) {
            $scope.numUpdatesAvailable = 0;
            $scope.numDevicePlugins = 0;
            $scope.notConfigured = PluginsService.notConfigured();
            $scope.failed = PluginsService.failed();
            $scope.installed = [];
            if (includeRemote) {
              $scope.available = [];
            }
            $scope.setupComplete = false;
            plugins.forEach(function(plugin) {
                if (plugin.currentVersion && (plugin.type === 'PLUGIN' || $scope.state.includeFrameworkPlugins || plugin.links.update || $scope.updates[plugin.id])) {
                    $scope.installed.push(plugin);
                    if (plugin.links && plugin.links.update) {
                      $scope.updates[plugin.id] = plugin.links.update;
                    }
                    if ($scope.updates[plugin.id]) {
                      $scope.numUpdatesAvailable++;
                    }
                }
                if (includeRemote && plugin.status.status === 'NOT_INSTALLED' && plugin.type === 'PLUGIN') {
                    $scope.available.push(plugin);
                }
            });
            if ($scope.numUpdatesAvailable === 1) {
                $scope.availableMsg = 'There is 1 plugin update available.';
            } else {
                $scope.availableMsg = 'There are ' + $scope.numUpdatesAvailable + ' plugin updates available.';
            }
        };

        $scope.$watch('state.includeFrameworkPlugins', function() {
          $scope.refresh(false);
        });

        $scope.reloadPlugin = function(plugin) {
            plugin.pendingReload = true;
            $scope.loadingPromise = PluginsService.reload(plugin);
            $scope.loadingPromise.then(function() {
                plugin.pendingReload = false;
                toastr.success(plugin.name + ' is being reloaded.', null, {
                    closeButton: true
                });
            });
        };

        /**
         * Install the input plugin from the OSGI repository.  The service
         * call to install the plugin returns almost immediately with a 204.
         * To provide user feedback, poll at regular intervals until the
         * plugin is installed.
         *
         * @param plugin plugin with HATEOS link for install
         */
        $scope.installPlugin = function(plugin) {
            // turn on the busy indicator
            plugin.pendingUpdate = true;

            // calling install returns a promise, which when resolved is
            // a 202 return so set up an $interval function to poll until the
            // installation completes.
            PluginsService.install(plugin).then(function() {
                // the state of the plugins has changed, refresh
                $scope.loadingPromise = PluginsService.getPlugins(true, true);
                $scope.loadingPromise.then(setPlugins, true);

                // show the user a non-modal notification
                toastr.success(plugin.name + ' has been installed successfully.', null, {
                    closeButton: true
                });
                plugin.pendingUpdate = false;
            }, function() {
                // failure
                toastr.error(plugin.name + ' encounted an error during installation. Check the log for details.', null, {
                    closeButton: true
                });
                plugin.pendingUpdate = false;
            });
        };

        /**
         * Update the input plugin from the OSGI repository.
         *
         * @param plugin plugin with HATEOS link for updating
         */
        $scope.update = function(plugin) {
            // turn on the busy indicator
            plugin.pendingUpdate = true;

            PluginsService.update(plugin).then(function() {
                $scope.updates[plugin.id] = null;

                // the state of the plugins has changed, refresh
                $scope.loadingPromise = PluginsService.getPlugins(true, true);
                $scope.loadingPromise.then(setPlugins, true);

                // show the user a non-modal notification
                toastr.success(plugin.name + ' has been updated successfully', null, {
                    closeButton: true
                });
                plugin.pendingUpdate = false;
            }, function() {
                // failure
                toastr.error(plugin.name + ' encounted an error during installation. Check the log for details.', null, {
                    closeButton: true
                });
                plugin.pendingUpdate = false;
            });
        };

        /**
         * Show the settings dialog.
         *
         * @param plugin plugin with the HATEOAS link for retrieving/setting configuration
         */
        $scope.showSettings = function(plugin) {
            if (plugin.links.configuration) {
                DialogContextService.setParams({plugin: plugin});
                var mi = $modal.open({
                    templateUrl: 'views/partials/plugin_configuration_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            } else {
                // we shouldn't ever get here since the UI button should have been disabled but it's always
                // good to make sure
                console.error('A plugin settings button with no associated configuration link was clicked');
            }
        };

        /**
         * Load the top-level API resource.
         */
        $scope.loadTopLevel = function() {
           ApiService.topLevel().then(function(topLevel) {
             $scope.topLevel = topLevel;
             // start a 10 second auto-refresh
             refreshInterval = $interval(function() {
               $scope.refresh(false);
             }, 10000);
             $scope.refresh(true);
           });
        };

        /**
         * Refreshes the list of plugins.
         */
        $scope.refresh = function(includeRemotePlugins) {
            if ($scope.topLevel) {
              $scope.loadPlugins($scope.topLevel.links.plugins, includeRemotePlugins);
            }
        };

        $scope.$on('$destroy', function() {
          // stop the 10 second auto refresh
          $interval.cancel(refreshInterval);
        });

        /**
         * Load the list of plugins from the server.
         *
         * @param pluginsUri
         * @param includeRemotePlugins
         */
        $scope.loadPlugins = function(pluginsUri, includeRemotePlugins) {
            PluginsService.getPlugins(pluginsUri, includeRemotePlugins, true).then(function(response) {
              setPlugins(response, includeRemotePlugins);
            });
        };

        AppData.currentTab = 'plugins';

        $scope.installed = [];
        $scope.available = [];
        $scope.numUpdatesAvailable = 0;

        $scope.loadTopLevel();
    }]);
