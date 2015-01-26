'use strict';

angular.module('hobsonApp').
    controller('DeviceSettingsDialogController', ['$scope', 'AppData', 'DevicesService', 'DialogContextService', 'toastr',
        function($scope, AppData, DevicesService, DialogContextService, toastr) {

            $scope.deviceName = DialogContextService.getParams().deviceName;
            $scope.formData = {};
            $scope.formFields = [];
            $scope.formOptions = {
                uniqueFormId: 'myFormId',
                hideSubmit: true
            };

            var setDeviceConfig = function(config) {
                for (var key in config) {
                  var prop = config[key];
                  var data = {
                      key: key,
                      label: prop.name,
                      description: prop.description,
                      required: false,
                      disabled: false
                    };

                    if (prop.enumValues) {
                      data.type = 'select';
                      data.options = [];
                      for (var enumKey in prop.enumValues) {
                        var name = prop.enumValues[enumKey].name;
                        data.options.push({
                          name: name,
                          value: enumKey
                        });
                      }
                    } else {
                      switch (prop.type) {
                        case 'BOOLEAN':
                          data.type = 'checkbox';
                          break;
                        case 'NUMBER':
                          data.type = 'number';
                          break;
                        case 'PASSWORD':
                          data.type = 'password';
                          break;
                        default:
                          data.type = 'text';
                          break;
                      }
                    }

                    $scope.formFields.push(data);
                    $scope.formData[key] = prop.value;
                }
            };

            /**
             * Save the settings.
             */
            $scope.save = function() {
                var newConfig = {};

                for (var key in $scope.formData) {
                    var data = $scope.formData[key];
                    if (data) {
                        newConfig[key] = {};
                        newConfig[key].value = $scope.formData[key];
                    }
                }

                // TODO: how to detect a failure?
                DevicesService.setDeviceConfig(DialogContextService.getParams().deviceConfigLink, newConfig).then(function() {
                    toastr.info(DialogContextService.getParams().deviceName + ' configuration saved. Any changes may take a few seconds to take effect.');
                    DialogContextService.currentModalInstance().dismiss();
                });
            };

            /**
             * Dismiss the configuration dialog.
             */
            $scope.cancel = function() {
                DialogContextService.currentModalInstance().dismiss();
            };

            $scope.loadingPromise = DevicesService.getDeviceConfig(DialogContextService.getParams().deviceConfigLink);
            $scope.loadingPromise.then(setDeviceConfig);
        }]);
