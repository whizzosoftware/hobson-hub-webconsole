'use strict';

angular.module('hobsonApp').
    controller('SettingsController', ['$scope', '$modal', 'AppData', 'ApiService', 'SettingsService', 'DialogContextService', 'toastr',
        function($scope, $modal, AppData, ApiService, SettingsService, DialogContextService, toastr) {
            $scope.shuttingDown = false;
            $scope.isShutdownCollapsed = true;

            var setConfiguration = function(result) {
                console.debug('configuration = ', result.data);
                $scope.name = result.data.name;
                if (result.data.location) {
                  $scope.address = result.data.location.text;
                  $scope.latitude = result.data.location.latitude;
                  $scope.longitude = result.data.location.longitude;
                }
                $scope.logLevel = result.data.logLevel;
            };

            $scope.shutdown = function() {
                $scope.shuttingDown = true;
                SettingsService.shutdown($scope.topLevel.links.shutdown).then(function() {
                    $scope.shuttingDown = false;
                    $scope.isCollapsed = true;
                    toastr.success('The hub has begun shutting down.', null, {
                        closeButton: true
                    });
                }, function() {
                    $scope.shuttingDown = false;
                    $scope.isCollapsed = true;
                    toastr.error('An error occurred. Please check the log for details.', null, {
                        closeButton: true
                    });
                });
            };

            $scope.save = function() {
                var config = {
                  logLevel: $scope.logLevel
                };

                if ($scope.name && $scope.name !== '') {
                  config.name = $scope.name;
                }
                if ($scope.address && $scope.address !== '') {
                  if (!config.location) {
                    config.location = {};
                  }
                  config.location.text = $scope.address;
                }
                if ($scope.latitude && $scope.latitude !== '') {
                  if (!config.location) {
                    config.location = {};
                  }
                  config.location.latitude = parseFloat($scope.latitude);
                }
                if ($scope.longitude && $scope.longitude !== '') {
                  if (!config.location) {
                    config.location = {};
                  }
                  config.location.longitude = parseFloat($scope.longitude);
                }

                SettingsService.setConfiguration($scope.topLevel.links.configuration, config).then(function() {
                  toastr.success('The settings have been saved.', null, {
                    closeButton: true
                  });
                });
            };

            $scope.showLocation = function() {
                window.open('https://www.google.com/maps/place/' + encodeURIComponent($scope.address));
            };

            $scope.onLogLevelChange = function(logLevel) {
                console.debug('onLogLevelChange: ', logLevel);
                SettingsService.setLogLevel(logLevel);
                // show the user a non-modal notification
                toastr.success('The log level has been changed.', null, {
                    closeButton: true
                });
            };

            $scope.viewLog = function() {
                var mi = $modal.open({
                    templateUrl: 'views/partials/log_viewer_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            AppData.currentTab = 'settings';

            ApiService.topLevel().then(function(topLevel) {
              $scope.topLevel = topLevel;
              SettingsService.getConfiguration(topLevel.links.configuration).then(function(result) {
                setConfiguration(result);
              });
            });
        }]);
