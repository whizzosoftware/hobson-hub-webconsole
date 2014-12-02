'use strict';

angular.module('hobsonApp').
    controller('SettingsController', ['$scope', '$modal', 'AppData', 'SettingsService', 'DialogContextService', 'toastr',
        function($scope, $modal, AppData, SettingsService, DialogContextService, toastr) {
            $scope.shuttingDown = false;
            $scope.isCollapsed = true;

            var setLogLevel = function(result) {
                console.debug('logLevel = ', result.data);
                $scope.logLevel = result.data.logLevel;
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

            $scope.viewLog = function() {
                var mi = $modal.open({
                    templateUrl: 'views/partials/log_viewer_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            AppData.currentTab = 'settings';

            $scope.loadingPromise = SettingsService.getLogLevel();
            $scope.loadingPromise.then(setLogLevel);
        }]);
