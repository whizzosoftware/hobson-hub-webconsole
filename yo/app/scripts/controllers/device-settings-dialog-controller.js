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
                console.debug('config = ', config);

                for (var key in config) {
                    var prop = config[key];
                    var type;

                    switch (prop.type) {
                        case 'BOOLEAN':
                            type = 'checkbox';
                            break;
                        case 'NUMBER':
                            type = 'number';
                            break;
                        case 'PASSWORD':
                            type = 'password';
                            break;
                        default:
                            type = 'text';
                            break;
                    }

                    $scope.formFields.push({
                        key: key,
                        type: type,
                        label: prop.name,
                        description: prop.description,
                        required: false,
                        disabled: false
                    });

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
