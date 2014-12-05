'use strict';

angular.module('hobsonApp').
  controller('AddTasksController', ['$scope', '$filter', 'AppData', 'TasksService', 'DevicesService', 'DialogContextService', '$modal', 'toastr', 'monthsOfYear', 'daysOfWeek', 'daysOfMonth',
    function ($scope, $filter, AppData, TasksService, DevicesService, DialogContextService, $modal, toastr, monthsOfYear, daysOfWeek, daysOfMonth) {
      $scope.monthsOfYear = monthsOfYear;
      $scope.daysOfWeek = daysOfWeek;
      $scope.daysOfMonth = daysOfMonth;
      $scope.devices = {'none': 'No devices found'};
      $scope.deviceEvents = {'none': 'No device events found'};

      $scope.recurrence = {
        rule: {},
        repeat: -1,
        end: 'never',
        interval: 1,
        count: 30,
        startDate: new Date(),
        startTime: new Date(),
        timeType: 'time',
        sunOffsetType: 'SR',
        sunOffsetValue: 0,
        sunOffsetMult: 1,
        endDate: new Date()
      };

      $scope.event = {
        device: 'none',
        changeId: 'none'
      };

      $scope.byWeekDay = {
        'Mon': false,
        'Tue': false,
        'Wed': false,
        'Thu': false,
        'Fri': false,
        'Sat': false,
        'Sun': false
      };

      var updateRRULE = function () {
        var freq = parseInt($scope.recurrence.repeat);
        if (freq > -1) {
          var options = {
            freq: freq,
            interval: $scope.recurrence.interval
          };

          // set byweekday
          if (freq === 2) {
            options.byweekday = [];
            if ($scope.byWeekDay.Mon) {
              options.byweekday.push(RRule.MO);
            }
            if ($scope.byWeekDay.Tue) {
              options.byweekday.push(RRule.TU);
            }
            if ($scope.byWeekDay.Wed) {
              options.byweekday.push(RRule.WE);
            }
            if ($scope.byWeekDay.Thu) {
              options.byweekday.push(RRule.TH);
            }
            if ($scope.byWeekDay.Fri) {
              options.byweekday.push(RRule.FR);
            }
            if ($scope.byWeekDay.Sat) {
              options.byweekday.push(RRule.SA);
            }
            if ($scope.byWeekDay.Sun) {
              options.byweekday.push(RRule.SU);
            }
          }

          // set bymonthday
          if (freq === 1) {
            if ($scope.recurrence.monthrepeat === 'bymonthday') {
              options.bymonthday = parseInt($scope.recurrence.byMonthDay);
            } else if ($scope.recurrence.monthrepeat === 'byweekday') {
              options.bysetpos = parseInt($scope.recurrence.setpos);
              options.byweekday = [];
              if ($scope.recurrence.month2.name === 'Monday') {
                options.byweekday.push(RRule.MO);
              } else if ($scope.recurrence.month2.name === 'Tuesday') {
                options.byweekday.push(RRule.TU);
              } else if ($scope.recurrence.month2.name === 'Wednesday') {
                options.byweekday.push(RRule.WE);
              } else if ($scope.recurrence.month2.name === 'Thursday') {
                options.byweekday.push(RRule.TH);
              } else if ($scope.recurrence.month2.name === 'Friday') {
                options.byweekday.push(RRule.FR);
              } else if ($scope.recurrence.month2.name === 'Saturday') {
                options.byweekday.push(RRule.SA);
              } else if ($scope.recurrence.month2.name === 'Sunday') {
                options.byweekday.push(RRule.SU);
              }
            }
          }

          // set recurrence end
          if ($scope.recurrence.end === 'after') {
            options.count = $scope.recurrence.count;
          } else if ($scope.recurrence.end === 'ondate') {
            options.until = $scope.recurrence.endDate;
          }
          $scope.recurrence.rule = new RRule(options);
        } else {
          $scope.recurrence.rule = null;
        }
      };

      $scope.task = {
        provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
        actions: []
      };

      $scope.add = function () {

        // create the task conditions
        var condition = {};

        if ($scope.task.provider === 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler') {
          // update the recurrence rule
          updateRRULE();

          // if a recurrence rule is defined, add it to the conditions
          if ($scope.recurrence.rule) {
            condition.recurrence = $scope.recurrence.rule.toString();
          }

          if ($scope.recurrence.timeType === 'sunOffset') {
            condition.sunOffset = $scope.recurrence.sunOffsetType;
            if ($scope.recurrence.sunOffsetValue > 0) {
              condition.sunOffset += ($scope.recurrence.sunOffsetValue * $scope.recurrence.sunOffsetMult);
            }
            condition.start = $filter('date')($scope.recurrence.startDate, 'yyyyMMddT000000');
          } else {
            var d = new Date(
              $scope.recurrence.startDate.getFullYear(),
              $scope.recurrence.startDate.getMonth(),
              $scope.recurrence.startDate.getDate(),
              $scope.recurrence.startTime.getHours(),
              $scope.recurrence.startTime.getMinutes(),
              0
            );
            condition.start = $filter('date')(d, 'yyyyMMddTHHmmss');
          }
        } else {
          condition.pluginId = $scope.devices[$scope.event.device].pluginId;
          condition.deviceId = $scope.event.device;
          condition.changeId = $scope.event.changeId;
          condition.event = $scope.event.type;
        }

        $scope.task.conditions = new Array(condition);

        console.debug($scope.task);

        TasksService.addTask($scope.task).then(function() {
            toastr.info('The task has been created.');
            DialogContextService.popModalInstance().dismiss();
            // TODO: refresh UI
        });
      };

      $scope.onSelectEventType = function () {
        DevicesService.getDevices().then(function (results) {
          if (results.length > 0) {
            $scope.devices = {};
            for (var i in results) {
              var device = results[i];
              $scope.devices[device.id] = device;
            }
            $scope.event.device = null;
          }
        });
      };

      $scope.onSelectEventDevice = function () {
        var device = $scope.devices[$scope.event.device];
        console.debug(device);
        DevicesService.getDeviceVariableEvents(device.links.variableEvents).then(function (results) {
          if (results.length > 0) {
            $scope.deviceEvents = {};
            for (var vid in results) {
              var desc = createDescriptionForChangeId(results[vid]);
              if (desc) {
                $scope.deviceEvents[results[vid]] = desc;
              }
            }
            $scope.event.changeId = null;
          } else {
            $scope.deviceEvents = {'none': 'No device events found'};
            $scope.event.changeId = 'none';
          }
        });
      };

      var createDescriptionForChangeId = function(changeId) {
        if (changeId === 'turnOn') {
          return 'turns on';
        } else if (changeId === 'turnOff') {
          return 'turns off';
        } else {
          return null;
        }
      };

      $scope.onSelectEventDeviceEvent = function () {
      };

      $scope.cancel = function () {
        DialogContextService.currentModalInstance().dismiss();
      };

      $scope.addAction = function () {
        DialogContextService.setParams({task: $scope.task});
        var mi = $modal.open({
          templateUrl: 'views/partials/add_action_dialog.html',
          size: 'lg',
          backdrop: 'static'
        });
        DialogContextService.pushModalInstance(mi);
      };

      $scope.removeAction = function (index) {
        $scope.task.actions.splice(index, 1);
      };
    }
  ]);
