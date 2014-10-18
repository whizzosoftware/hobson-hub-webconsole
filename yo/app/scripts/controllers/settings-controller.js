'use strict';

angular.module('hobsonApp').
    controller('SettingsController', ['$scope', 'AppData', 'SettingsService', 'toastr',
        function($scope, AppData, SettingsService, toastr) {
            $scope.shuttingDown = false;
            $scope.isCollapsed = true;

            var setLogLevel = function(result) {
                console.debug('logLevel = ', result.data);
                $scope.logLevel = result.data.value;
            };

            $scope.shutdown = function() {
                $scope.shuttingDown = true;
                SettingsService.shutdown().then(function() {
                    $scope.shuttingDown = false;
                    $scope.isCollapsed = true;
                    toastr.success('The hub has successfully shut down.', null, {
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

            $scope.onLogLevelChange = function(logLevel) {
                console.debug('onLogLevelChange: ', logLevel);
                SettingsService.setLogLevel(logLevel);
                // show the user a non-modal notification
                toastr.success('The log level has been changed.', null, {
                    closeButton: true
                });
            };

            AppData.currentTab = 'settings';

            $scope.loadingPromise = SettingsService.getLogLevel();
            $scope.loadingPromise.then(setLogLevel);
        }]);
