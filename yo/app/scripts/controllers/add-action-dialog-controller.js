'use strict';

angular.module('hobsonApp').
  controller('AddActionController', ['$scope', 'PluginsService', 'DevicesService', 'ActionsService', 'DialogContextService',
    function ($scope, PluginsService, DevicesService, ActionsService, DialogContextService) {
      var deviceFormOptions;
      var commandFormOptions;
      var commandEnumeration;
      var commandParamField;
      var lastLoadedDeviceId;
      var devicesLoaded = false;

      $scope.actionArg = null;
      $scope.actionTypes = {};
      $scope.actionName = 'New Action';
      $scope.formData = {};
      $scope.formFields = [];
      $scope.formOptions = {
        uniqueFormId: 'actionForm',
        hideSubmit: true
      };

      $scope.add = function (form) {
        if (form.$valid) {
          if ($scope.actionArg) {
            // set the properties of the action argument that was passed in for updating
            $scope.actionArg.pluginId = $scope.actions[$scope.actionId].pluginId;
            $scope.actionArg.actionId = $scope.actionId;
            $scope.actionArg.name = $scope.actionName;
            $scope.actionArg.properties = $scope.formData;
          } else {
            // create a new action in the task state that was passed in
            $scope.taskState.actions.push({
              pluginId: $scope.actions[$scope.actionId].pluginId,
              actionId: $scope.actionId,
              name: $scope.actionName,
              properties: $scope.formData
            });
          }
          DialogContextService.currentModalInstance().dismiss();
        }
      };

      $scope.cancel = function () {
        DialogContextService.currentModalInstance().dismiss();
      };

      $scope.loadingPromise = ActionsService.getActions();
      $scope.loadingPromise.then(function(actions) {
        // set the list of actions in the scope
        $scope.actions = actions;
        for (var key in actions) {
          $scope.actionTypes[key] = actions[key].name;
        }

        // add a watch for actionId changes
        $scope.$watch('actionId', function(newValue) {
          if (newValue && $scope.actions[newValue]) {
            ActionsService.getAction($scope.actions[newValue]).then(function (response) {
              // build a form from the action meta info
              $scope.formFields = [];

              for (var i=0; i < response.metaOrder.length; i++) {
                var key = response.metaOrder[i];
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
                  continue;
                } else if (key === 'deviceId') {
                  formOptions.type = 'select';
                  formOptions.label = 'Device'; // change Device ID -> Device since we're giving the user a dropdown
                  formOptions.options = [];
                  deviceFormOptions = formOptions.options;
                } else if (key === 'commandId' && prop.type === 'ENUMERATION') {
                  formOptions.type = 'select';
                  formOptions.options = [];
                  commandFormOptions = formOptions.options;
                  commandEnumeration = prop.enumValues;

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
                  // if there's currently a value for this field, set it
                  if ($scope.actionArg && $scope.actionArg.properties && $scope.actionArg.properties[key]) {
                    $scope.formData[key] = $scope.actionArg.properties[key];
                  }
                }

                // add the form field
                $scope.formFields.push(formOptions);
              }

              // add a watch for deviceId changes
              $scope.$watch('formData.deviceId', function(deviceId) {
                loadDevice(deviceId);
              });

              // add a watch for commandId changes
              $scope.$watch('formData.commandId', function (commandId) {
                if (commandId && commandEnumeration) {
                  if (commandEnumeration[commandId].param) {
                    var param = commandEnumeration[commandId].param;
                    commandParamField.label = param.name;
                    commandParamField.description = param.description;
                    switch (param.type) {
                      case 'BOOLEAN':
                        commandParamField.type = 'checkbox';
                        break;
                      case 'NUMBER':
                        commandParamField.type = 'number';
                        break;
                      case 'COLOR':
                        commandParamField.template = '<div class="form-group"><label>Color</label><br/><spectrum-colorpicker ng-model="color" options="{showInput: false, preferredFormat: \'rgb\'}"></spectrum-colorpicker></div>';
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

              if (newValue === 'sendDeviceCommand') {
                loadDevices();
              }
            });
          }
        });

        var loadDevices = function() {
          if (!devicesLoaded) {
            devicesLoaded = true;
            DevicesService.getDevices($scope.topLevel.links.devices).then(function (results) {
              $scope.devices = {};
              deviceFormOptions.length = 0;
              for (var i in results) {
                var device = results[i];
                $scope.devices[device.id] = device;
                deviceFormOptions.push({name: device.name, value: device.id});
              }
              if ($scope.formData.deviceId) {
                loadDevice($scope.formData.deviceId);
              }
            });
          }
        };

        var loadDevice = function(deviceId) {
          if (deviceId && $scope.devices && lastLoadedDeviceId !== deviceId) {
            lastLoadedDeviceId = deviceId;
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
        };

        $scope.$on('spectrum-hide', function(event) {
          $scope.formData.param = event.targetScope.color.replace(/ /g,'');
        });

        // set the current state
        $scope.topLevel = DialogContextService.getParams().topLevel;
        $scope.taskState = DialogContextService.getParams().state;
        $scope.actionArg = DialogContextService.getParams().action;
        if ($scope.actionArg) {
          $scope.pluginId = $scope.actionArg.pluginId;
          $scope.actionId = $scope.actionArg.actionId;
          $scope.actionName = $scope.actionArg.name;
          if ($scope.actionArg.properties) {
            for (var keyName in $scope.actionArg.properties) {
              $scope.formData[keyName] = $scope.actionArg.properties[keyName];
            }
          }
        }
        DialogContextService.clearParams();
      });
    }
  ]);
