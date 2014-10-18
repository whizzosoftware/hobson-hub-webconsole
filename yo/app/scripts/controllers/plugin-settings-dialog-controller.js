'use strict';

angular.module('hobsonApp').
    controller('PluginSettingsDialogController', ['$scope', 'AppData', 'PluginsService', 'DialogContextService', 'toastr',
        function($scope, AppData, PluginsService, DialogContextService, toastr) {

            $scope.pluginName = DialogContextService.getParams().plugin.name;
            $scope.formData = {};
            $scope.formFields = [];
            $scope.formOptions = {
                uniqueFormId: 'myFormId',
                hideSubmit: true
            };

            var setPluginConfiguration = function(config) {
                console.debug('config = ', config);
                for (var key in config.properties) {
                    var prop = config.properties[key];
                    var type;

                    switch (prop.type) {
                        case 'BOOLEAN':
                            type = 'checkbox';
                            break;
                        case 'NUMBER':
                            type = 'number';
                            break;
                        default:
                            type = 'text';
                            break;
                    }

                    console.debug(prop.value);

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
             * Save the configuration settings.
             */
            $scope.save = function() {
                var newConfig = {};
                newConfig.properties = {};

                for (var key in $scope.formData) {
                    var data = $scope.formData[key];
                    if (data) {
                        newConfig.properties[key] = {};
                        newConfig.properties[key].value = $scope.formData[key];
                    }
                }

                // TODO: how to detect a failure?
                PluginsService.setPluginConfiguration(DialogContextService.getParams().plugin, newConfig).then(function() {
                    toastr.info(DialogContextService.getParams().plugin.name + ' configuration saved. Any changes may take a few seconds to take effect.');
                    DialogContextService.currentModalInstance().dismiss();
                });
            };

            /**
             * Dismiss the configuration dialog.
             */
            $scope.cancel = function() {
                DialogContextService.currentModalInstance().dismiss();
            };

            $scope.loadingPromise = PluginsService.getPluginConfiguration(DialogContextService.getParams().plugin);
            $scope.loadingPromise.then(setPluginConfiguration);
        }]);
