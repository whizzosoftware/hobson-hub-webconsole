'use strict';

angular.module('hobsonApp').
    controller('DeviceDetailsDialogController', ['$scope', '$timeout', '$modal', 'AppData', 'DevicesService', 'DialogContextService', 'VariableDescriptionService', 'toastr',
        function($scope, $timeout, $modal, AppData, DevicesService, DialogContextService, VariableDescriptionService, toastr) {
            var delays = {};

            $scope.deviceName = DialogContextService.getParams().deviceName;
            $scope.status = {
                pendingOnUpdate: false,
                pendingLevelUpdate: false,
                pendingTstatModeUpdate: false,
                pendingTstatFanModeUpdate: false,
                pendingTstatCoolPointUpdate: false,
                pendingTstatHeatPointUpdate: false,
                pendingTstatAutoPointUpdate: false
            };

            $scope.$on('spectrum-hide', function() {
                var newValue = $scope.status.color.replace(/ /g,'');
                var oldValue = $scope.device.variables.color.value.replace(/ /g,'');
                console.debug('Finished with color: ' + newValue + ', old value is ' + oldValue);
                if (newValue !== oldValue) {
                    DevicesService.setDeviceVariable($scope.device.variables.color.links.self, '"' + newValue + '"');
                    $scope.device.variables.color.value = newValue;
                }
            });

            var setDevice = function(device) {
                console.debug('device = ', device);
                $scope.device = device;

                if (device.variables.on) {
                    $scope.status.on = device.variables.on.value;
                }

                if (device.variables.color) {
                    $scope.status.color = device.variables.color.value;
                }

                if ($scope.device.variables.level) {
                    $scope.status.level = device.variables.level.value;
                    $scope.$watch('status.level', function(level) {
                        console.debug('level: ' + level);
                        if ($scope.status.level !== device.variables.level.value) {
                            $scope.status.pendingLevelUpdate = true;
                            DevicesService.setDeviceVariable($scope.device.variables.level.links.self, level).then(function() {
                                $scope.status.pendingLevelUpdate = false;
                            }, function() {
                                $scope.status.pendingLevelUpdate = false;
                            });
                        }
                    });
                }

                // Thermostat variables

                if ($scope.device.variables['targetCoolTempF']) {
                    $scope.status.coolpoint = device.variables['targetCoolTempF'].value;
                    $scope.$watch('status.coolpoint', function(val) {
                        $timeout.cancel(delays.coolpoint);
                        delays.coolpoint = $timeout(function() {
                            if ($scope.device.variables['targetCoolTempF'].value !== val) {
                                console.debug('Coolpoint: ' + val);
                                $scope.status.pendingTstatCoolPointUpdate = true;
                                DevicesService.setDeviceVariable($scope.device.variables['targetCoolTempF'].links.self, val).then(function() {
                                    $scope.status.pendingTstatCoolPointUpdate = false;
                                    $scope.device.variables['targetCoolTempF'].value = val;
                                }, function() {
                                    $scope.status.pendingTstatCoolPointUpdate = false;
                                    $scope.status.coolpoint = $scope.device.variables['targetCoolTempF'].value;
                                    toastr.error('Unable to update thermostat cool point');
                                });
                            }
                        }, 500);
                    });
                }
                if ($scope.device.variables['targetHeatTempF']) {
                    $scope.status.heatpoint = device.variables['targetHeatTempF'].value;
                    $scope.$watch('status.heatpoint', function(val) {
                        $timeout.cancel(delays.heatpoint);
                        delays.heatpoint = $timeout(function() {
                            if ($scope.device.variables['targetHeatTempF'].value !== val) {
                                console.debug('Heatpoint: ' + val);
                                $scope.status.pendingTstatHeatPointUpdate = true;
                                DevicesService.setDeviceVariable($scope.device.variables['targetHeatTempF'].links.self, val).then(function() {
                                    $scope.status.pendingTstatHeatPointUpdate = false;
                                    $scope.device.variables['targetHeatTempF'].value = val;
                                }, function() {
                                    $scope.status.pendingTstatHeatPointUpdate = false;
                                    $scope.status.heatpoint = $scope.device.variables['targetHeatTempF'].value;
                                    toastr.error('Unable to update thermostat heat point');
                                });
                            }
                        }, 500);
                    });
                }
                if ($scope.device.variables['targetTempF']) {
                    $scope.status.autopoint = device.variables['targetTempF'].value;
                    $scope.$watch('status.autopoint', function(val) {
                        $timeout.cancel(delays.autopoint);
                        delays.autopoint = $timeout(function() {
                            if ($scope.device.variables['targetTempF'].value !== val) {
                                console.debug('Auto: ' + val);
                                $scope.status.pendingTstatAutoPointUpdate = true;
                                DevicesService.setDeviceVariable($scope.device.variables['targetTempF'].links.self, val).then(function() {
                                    $scope.status.pendingTstatAutoPointUpdate = false;
                                    $scope.device.variables['targetAutoTempF'].value = val;
                                }, function() {
                                    $scope.status.pendingTstatAutoPointUpdate = false;
                                    $scope.status.autopoint = $scope.device.variables['targetTempF'].value;
                                    toastr.error('Unable to update thermostat auto point');
                                });
                            }
                        }, 500);
                    });
                }
                if ($scope.device.variables['tstatMode']) {
                    $scope.status['tstatMode'] = device.variables['tstatMode'].value;
                }
                if ($scope.device.variables['tstatFanMode']) {
                    $scope.status['tstatFanMode'] = device.variables['tstatFanMode'].value;
                }

                if ($scope.device.links.telemetry) {
                  DevicesService.getDeviceTelemetry($scope.device.links.telemetry).then(function(results) {
                      $scope.status.chartConfig = {
                        options: {
                          chart: {
                            type: 'line',
                            height: 250
                          }
                        },
                        xAxis: {
                          type: 'datetime'
                        },
                        series: [
                        ],
                        title: {
                          text: 'Device Telemetry'
                        }
                      };

                      for (var varName in results) {
                        var data = {
                          name: VariableDescriptionService.getDescription(varName),
                          data: []
                        };
                        for (var point in results[varName]) {
                          var o = results[varName][point];
                          data.data.push([parseFloat(o.time), parseFloat(o.value)]);
                        }
                        $scope.status.chartConfig.series.push(data);
                      }
                  }, function() {
                      toastr.error('Error retriving device telemetry');
                  });
                }
            };

            $scope.onOn = function() {
                $scope.status.pendingOnUpdate = true;
                var newValue = !$scope.status.on;
                DevicesService.setDeviceVariable($scope.device.variables.on.links.self, newValue).then(function() {
                    $scope.status.pendingOnUpdate = false;
                    $scope.status.on = newValue;
                    $scope.device.variables.on.value = newValue;
                }, function() {
                    $scope.status.pendingOnUpdate = false;
                    toastr.error('Unable to turn device on/off');
                });
            };

            $scope.onTstatMode = function(mode) {
                $scope.status.pendingTstatModeUpdate = true;
                DevicesService.setDeviceVariable($scope.device.variables['tstatMode'].links.self, mode.toUpperCase()).then(function() {
                    $scope.status.pendingTstatModeUpdate = false;
                    $scope.status['tstatMode'] = mode;
                }, function() {
                    $scope.status.pendingTstatModeUpdate = false;
                    toastr.error('Unable to update thermostat mode');
                });
            };

            $scope.onTstatFanMode = function(mode) {
                $scope.status.pendingTstatFanModeUpdate = true;
                DevicesService.setDeviceVariable($scope.device.variables['tstatFanMode'].links.self, mode.toUpperCase()).then(function() {
                    $scope.status.pendingTstatFanModeUpdate = false;
                    $scope.status['tstatFanMode'] = mode;
                }, function() {
                    $scope.status.pendingTstatFanModeUpdate = false;
                    toastr.error('Unable to update thermostat fan mode');
                });
            };

            $scope.showImage = function(device) {
                DialogContextService.setParams({deviceName: device.name, imageUrl: device.variables['imageStatusUrl'].value});
                var mi = $modal.open({
                    templateUrl: 'views/partials/image_view_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.showVideo = function(device) {
                DialogContextService.setParams({deviceName: device.name, videoUrl: device.variables['videoStatusUrl'].value});
                var mi = $modal.open({
                    templateUrl: 'views/partials/video_view_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.close = function () {
                DialogContextService.currentModalInstance().dismiss();
            };

            $scope.loadingPromise = DevicesService.getDevice(DialogContextService.getParams().deviceLink);
            $scope.loadingPromise.then(setDevice);
        }]);
