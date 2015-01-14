'use strict';

angular.module('hobsonApp').
    controller('DevicesController', ['$scope', '$http', '$interval', 'AppData', 'ApiService', 'DevicesService', 'DialogContextService', 'PollingService', '$modal', 'toastr',
        function($scope, $http, $interval, AppData, ApiService, DevicesService, DialogContextService, PollingService, $modal, toastr) {
            var refreshInterval;

            var setDevices = function(devices) {
                console.debug('devices = ', devices);
                $scope.devices = devices;
            };

            $scope.toggleSwitch = function(device) {
                device.pendingUpdate = true;
                var newValue = !device.preferredVariable.value;
                DevicesService.setDeviceVariable(device.preferredVariable.links.self, newValue).then(function() {
                    device.pendingUpdate = false;
                    device.preferredVariable.value = newValue;
                }, function() {
                    device.pendingUpdate = false;
                    device.preferredVariable.value = !newValue;
                    toastr.error('Failed to update: ' + device.name, null, {closeButton: true});
                });
            };

            $scope.viewImage = function(deviceName, link) {
                DialogContextService.setParams({deviceName: deviceName, imageUrl: link});
                var mi = $modal.open({
                    templateUrl: 'views/partials/image_view_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.viewVideo = function(deviceName, link) {
                DialogContextService.setParams({deviceName: deviceName, videoUrl: link});
                var mi = $modal.open({
                    templateUrl: 'views/partials/video_view_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.setDeviceName = function(link, val) {
                console.debug('setDeviceName: ' + link + ', ' + val);
                DevicesService.setDeviceName(link, val);
            };

            $scope.showDeviceDetails = function(link, name) {
                DialogContextService.setParams({deviceLink: link, deviceName: name});
                var mi = $modal.open({
                    templateUrl: 'views/partials/device_details_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.showDeviceSettings = function(link, name) {
                DialogContextService.setParams({deviceConfigLink: link, deviceName: name});
                var mi = $modal.open({
                    templateUrl: 'views/partials/device_settings_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            /**
             * Load the top-level API resource.
             */
            $scope.loadTopLevel = function() {
              ApiService.topLevel().then(function(topLevel) {
                $scope.topLevel = topLevel;
                $scope.refresh();
                // start a 5 second auto-refresh
                refreshInterval = $interval(function() {
                  $scope.refresh();
                }, 5000);
              });
            };

            /**
             * Refreshes the list of tasks.
             */
            $scope.refresh = function() {
              $scope.loadingPromise = DevicesService.getDevices($scope.topLevel.links.devices);
              $scope.loadingPromise.then(setDevices);
            };

            $scope.$on('$destroy', function() {
              // stop the 5 second auto-refresh
              $interval.cancel(refreshInterval);
            });

            AppData.currentTab = 'devices';
            $scope.devices = [];
            $scope.topLevel = null;

            $scope.loadTopLevel();
        }
    ]);
