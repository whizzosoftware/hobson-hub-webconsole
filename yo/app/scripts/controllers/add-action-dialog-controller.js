'use strict';

angular.module('hobsonApp').
  controller('AddActionController', ['$scope', 'PluginsService', 'DevicesService', 'ActionsService', 'DialogContextService',
    function ($scope, PluginsService, DevicesService, ActionsService, DialogContextService) {

      $scope.actionTypes = {};
      $scope.actionName = 'New Action';
      $scope.formData = {};
      $scope.formFields = [];
      $scope.formOptions = {
        uniqueFormId: 'actionForm',
        hideSubmit: true
      };

      var setActions = function (actions) {
        console.debug('actions = ', actions);
        $scope.actions = actions;
        for (var key in actions) {
          $scope.actionTypes[key] = actions[key].name;
        }
      };

      $scope.onSelectAction = function () {
        ActionsService.getAction($scope.actions[$scope.actionId]).then(function (response) {
          // build a form from the action meta info
          $scope.formFields = [];

          var hadDeviceKey = false;
          var hadCommandKey = false;
          var deviceFormOptions;
          var commandFormOptions;
          var commandEnumeration;
          var commandParamField;

          for (var key in response.meta) {
            var prop = response.meta[key];

            var formOptions = {
              key: key,
              label: prop.name,
              description: prop.description,
              required: true,
              disabled: false
            };

            if (key === 'pluginId') {
              // ignore plugin id since we'll get that from the selected device
            } else if (key === 'deviceId') {
              formOptions.type = 'select';
              formOptions.label = 'Device'; // change Device ID -> Device since we're giving the user a dropdown
              formOptions.options = [];
              deviceFormOptions = formOptions.options;
              hadDeviceKey = true;
            } else if (key === 'commandId' && prop.type === 'ENUMERATION') {
              formOptions.type = 'select';
              formOptions.options = [];
              commandFormOptions = formOptions.options;
              commandEnumeration = prop.enumValues;
              hadCommandKey = true;

              // add the command parameter field (hidden by default)
              commandParamField = {
                key: 'param',
                type: 'text',
                required: false,
                hide: true
              };
              $scope.formFields.push(commandParamField);
            } else {
              formOptions.type = 'text';
            }

            $scope.formFields.push(formOptions);
          }

          // if there was a deviceId key, watch the pluginId for changes and load the device list
          if (hadDeviceKey) {
            DevicesService.getDevices().then(function (results) {
              $scope.devices = {};
              for (var i in results) {
                var device = results[i];
                $scope.devices[device.id] = device;
                deviceFormOptions.push({name: device.name, value: device.id});
              }
            });
          }

          if (hadCommandKey) {
            $scope.$watch('formData.deviceId', function (deviceId) {
              if (deviceId) {
                $scope.formData.pluginId = $scope.devices[$scope.formData.deviceId].pluginId;
                DevicesService.getDevice($scope.devices[deviceId].links.self).then(function (results) {
                  commandFormOptions.length = 0;
                  for (var commandId in commandEnumeration) {
                    var ce = commandEnumeration[commandId];
                    if (!ce.requiredDeviceVariable || results.variables[ce.requiredDeviceVariable]) {
                      commandFormOptions.push({name: ce.name, value: commandId});
                    }
                  }
                });
              }
            });
            $scope.$watch('formData.commandId', function (commandId) {
              if (commandId) {
                if (commandEnumeration[commandId].param) {
                  var param = commandEnumeration[commandId].param;
                  console.debug(param.name);
                  commandParamField.label = param.name;
                  commandParamField.description = param.description;
                  switch (param.type) {
                    case 'BOOLEAN':
                      commandParamField.type = 'checkbox';
                      break;
                    case 'NUMBER':
                      commandParamField.type = 'number';
                      break;
                    default:
                      commandParamField.type = 'text';
                      break;
                  }
                  commandParamField.hide = false;
                } else {
                  commandParamField.hide = true;
                }
              }
            });
          }
        });
      };

      $scope.add = function (form) {
        if (form.$valid) {
          var action = {
            pluginId: $scope.actions[$scope.actionId].pluginId,
            actionId: $scope.actionId,
            name: $scope.actionName,
            properties: $scope.formData
          };

          DialogContextService.getParams().task.actions.push(action);
          DialogContextService.currentModalInstance().dismiss();
        }
      };

      $scope.cancel = function () {
        DialogContextService.currentModalInstance().dismiss();
      };

      $scope.loadingPromise = ActionsService.getActions();
      $scope.loadingPromise.then(setActions);
    }
  ]);
