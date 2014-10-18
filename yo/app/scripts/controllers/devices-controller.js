'use strict';

angular.module('hobsonApp').
    controller('DevicesController', ['$scope', '$http', 'AppData', 'DevicesService', 'DialogContextService', 'PollingService', '$modal', 'toastr',
        function($scope, $http, AppData, DevicesService, DialogContextService, PollingService, $modal, toastr) {

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

            AppData.currentTab = 'devices';
            $scope.devices = [];

            $scope.loadingPromise = DevicesService.getDevices();
            $scope.loadingPromise.then(setDevices);
        }
    ]);
