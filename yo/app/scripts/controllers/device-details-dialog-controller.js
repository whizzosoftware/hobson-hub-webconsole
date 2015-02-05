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
                pendingTstatAutoPointUpdate: false
            };

            $scope.$on('spectrum-hide', function() {
                var newValue = $scope.status.color.replace(/ /g,'');
                var oldValue = $scope.device.variables.color.value.replace(/ /g,'');
                if (newValue !== oldValue) {
                    DevicesService.setDeviceVariable($scope.device.variables.color.links.self, '"' + newValue + '"');
                    $scope.device.variables.color.value = newValue;
                }
            });

            var setDevice = function(device) {
                $scope.device = device;

                if (device.variables.on) {
                    $scope.status.on = device.variables.on.value;
                }

                if (device.variables.color) {
                    $scope.status.color = device.variables.color.value;
                }

                if (device.links.enableTelemetry) {
                    $scope.status.telemetryEnabled = device.telemetryEnabled;
                    $scope.$watch('status.telemetryEnabled', function(val) {
                       console.debug('change to telemetryEnabled: ', val);
                       DevicesService.enableDeviceTelemetry($scope.device.links.enableTelemetry, val);
                       $scope.getTelemetry();
                    });
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

                if ($scope.device.telemetryEnabled) {
                  $scope.getTelemetry();
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

            $scope.onTstatCooler = function() {
              $scope.status.autopoint = Math.max(45, $scope.status.autopoint-1);
            };

            $scope.onTstatWarmer = function() {
              $scope.status.autopoint = Math.min(90, $scope.status.autopoint+1);
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

            $scope.getTelemetry = function() {
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
                    text: null
                  }
                };

                // determine timezone offset
                var offset = new Date().getTimezoneOffset() * 60000;

                console.debug(results);

                for (var varName in results) {
                  var data = {
                    name: VariableDescriptionService.getDescription(varName),
                    data: []
                  };
                  var varResults = results[varName];
                  for (var t in varResults) {
                    // apply timezone offset to the data
                    data.data.push([parseFloat(t) * 1000 - offset, parseFloat(varResults[t])]);
                  }
                  if (data.data.length > 0) {
                    $scope.status.chartConfig.series.push(data);
                  }
                }

                console.debug($scope.status.chartConfig.series);
              }, function() {
                toastr.error('Error retrieving device telemetry');
              });
            };

            $scope.close = function () {
                DialogContextService.currentModalInstance().dismiss();
            };

            $scope.loadingPromise = DevicesService.getDevice(DialogContextService.getParams().deviceLink);
            $scope.loadingPromise.then(setDevice);
        }]);
