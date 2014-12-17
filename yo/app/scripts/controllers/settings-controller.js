'use strict';

angular.module('hobsonApp').
    controller('SettingsController', ['$scope', '$modal', 'AppData', 'SettingsService', 'DialogContextService', 'toastr',
        function($scope, $modal, AppData, SettingsService, DialogContextService, toastr) {
            $scope.shuttingDown = false;
            $scope.isShutdownCollapsed = true;

            var setConfiguration = function(result) {
                console.debug('configuration = ', result.data);
                $scope.name = result.data.name;
                $scope.address = result.data.location.text;
                $scope.latitude = result.data.location.latitude;
                $scope.longitude = result.data.location.longitude;
                $scope.logLevel = result.data.logLevel;
            };

            $scope.shutdown = function() {
                $scope.shuttingDown = true;
                SettingsService.shutdown().then(function() {
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
                  name: $scope.name,
                  address: {
                    text: ($scope.address === '') ? null : $scope.address,
                    latitude: ($scope.latitude === '') ? null : parseFloat($scope.latitude),
                    longitude: ($scope.longitude === '') ? null : parseFloat($scope.longitude)
                  },
                  logLevel: $scope.logLevel
                };

                SettingsService.setConfiguration(config).then(function() {
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

            $scope.loadingPromise = SettingsService.getConfiguration();
            $scope.loadingPromise.then(setConfiguration);
        }]);
