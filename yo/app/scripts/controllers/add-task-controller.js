'use strict';

angular.module('hobsonApp').
  controller('AddTasksController', ['$scope', '$filter', 'AppData', 'TasksService', 'DevicesService', 'DialogContextService', '$modal', 'toastr', 'monthsOfYear', 'daysOfWeek', 'daysOfMonth',
    function ($scope, $filter, AppData, TasksService, DevicesService, DialogContextService, $modal, toastr, monthsOfYear, daysOfWeek, daysOfMonth) {
      // setup initial scope
      $scope.monthsOfYear = monthsOfYear;
      $scope.daysOfWeek = daysOfWeek;
      $scope.daysOfMonth = daysOfMonth;
      $scope.weekDayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      $scope.devices = {'none': 'No devices found'};
      $scope.deviceEvents = {'none': 'No device events found'};
      $scope.event = {
        device: 'none',
        changeId: 'none'
      };
      var defaultRecurrence = {
        type: -1,
        interval: 1,
        endType: 'never',
        count: 30,
        endDate: new Date(),
        weekDays: {
        }
      };

      $scope.onAdd = function () {
        var task = $scope.createTaskFromState($scope.state);
        TasksService.addTask(task).then(function() {
            toastr.info('The task has been created. It may take a few seconds to show up in the list.');
            DialogContextService.popModalInstance().dismiss();
        });
      };

      $scope.onUpdate = function() {
        var task = $scope.createTaskFromState($scope.state);
        TasksService.updateTask($scope.task.links.self, task).then(function() {
            toastr.info('The task has been updated. It may take a few seconds for the changes to appear in the list.');
            DialogContextService.popModalInstance().dismiss();
        });
      };

      $scope.onCancel = function () {
        DialogContextService.currentModalInstance().dismiss();
      };

      $scope.$watch('state.event.type', function(value) {
        if (value === 'variableUpdate') {
          DevicesService.getDevices($scope.topLevel.links.devices).then(function(results) {
            if (results.length > 0) {
              $scope.devices = {};
              for (var ix in results) {
                var device = results[ix];
                $scope.devices[device.id] = device;
              }
              loadDeviceVariables($scope.state.event.device);
            }
          });
        }
      });

      $scope.$watch('state.event.device', function(deviceId) {
        if (deviceId && deviceId !== 'none') {
          var device = $scope.devices[deviceId];
          if (device) {
            loadDeviceVariables($scope.state.event.device);
          }
        }
      });

      var loadDeviceVariables = function(deviceId) {
        if (deviceId) {
          var device = $scope.devices[deviceId];
          if (device) {
            DevicesService.getDevice(device.links.self).then(function (deviceDetails) {
              DevicesService.getDeviceVariableEvents(deviceDetails.links.variableEvents).then(function (results) {
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
            });
          }
        }
      };

      $scope.onAddAction = function () {
        DialogContextService.setParams({state: $scope.state, action: null, topLevel: $scope.topLevel});
        var mi = $modal.open({
          templateUrl: 'views/partials/add_action_dialog.html',
          size: 'lg',
          backdrop: 'static'
        });
        DialogContextService.pushModalInstance(mi);
      };

      $scope.onEditAction = function(index) {
        DialogContextService.setParams({state: $scope.state, action: $scope.state.actions[index], topLevel: $scope.topLevel});
        var mi = $modal.open({
          templateUrl: 'views/partials/add_action_dialog.html',
          size: 'lg',
          backdrop: 'static'
        });
        DialogContextService.pushModalInstance(mi);
      };

      $scope.onRemoveAction = function (index) {
        $scope.state.actions.splice(index, 1);
      };

      $scope.createTaskFromState = function(state) {
        var task = {
          name: state.name,
          provider: state.provider,
          conditions: [],
          actions: []
        };

        var condition = {};

        // if it's a scheduled task...
        if (state.provider === 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler') {
          // if recurrence is defined, add it to the conditions
          if (state.recurrence) {
            condition.recurrence = createRRULEFromState(state);
          }

          if (state.startType === 'sunOffset') {
            condition.sunOffset = state.sunOffsetType;
            if (state.sunOffsetValue > 0) {
              condition.sunOffset += (state.sunOffsetValue * state.sunOffsetMod);
            }
            condition.start = moment(state.startDate).utc().format('YYYYMMDDTHHmmSS') + 'Z';
          } else {
            if (state.startDate && state.startTime) {
              var d = new Date(
                state.startDate.getFullYear(),
                state.startDate.getMonth(),
                state.startDate.getDate(),
                state.startTime.getHours(),
                state.startTime.getMinutes(),
                0
              );
              condition.start = moment(d).utc().format('YYYYMMDDTHHmmSS') + 'Z';
            }
          }
        // otherwise assume it's an event-based task
        } else {
          condition.pluginId = $scope.devices[state.event.device].pluginId;
          condition.deviceId = state.event.device;
          condition.changeId = state.event.changeId;
          condition.event = state.event.type;
        }

        task.conditions.push(condition);

        task.actions = state.actions;

        return task;
      };

      $scope.createStateFromTask = function(task) {
        var state = {
          name: task.name,
          provider: task.provider
        };

        if (task.conditions && task.conditions[0]) {
          var c = task.conditions[0];

          // parse the start date
          if (c.start) {
            state.startDate = moment(c.start, 'YYYYMMDDTHHmmss').toDate();
          }

          if (c.event) {
            state.event = {
              type: c.event,
              device: c.deviceId,
              changeId: c.changeId
            };
          }

          // if there is a sunOffset key, populate the state with its information
          if (c.sunOffset) {
            state.startType = 'sunOffset';
            state.sunOffsetType = c.sunOffset.substr(0,2);
            state.sunOffsetMod = (parseInt(c.sunOffset.substr(2)) > 0) ? 1 : -1;
            state.sunOffsetValue = Math.abs(parseInt(c.sunOffset.substr(2)));
          // otherwise, assume it's a straight time
          } else {
            state.startType = 'time';
            state.startTime = state.startDate;
            state.sunOffsetType = 'SR';
            state.sunOffsetMod = 1;
            state.sunOffsetValue= 0;
          }

          // if there is a recurrence key, create the RRULE string
          if (c.recurrence) {
            state.recurrence = createRecurrenceStateFromRRULE(c.recurrence);
          } else {
            state.recurrence = defaultRecurrence;
          }
        }

        // if there are actions, save them to the state
        if (task.actions) {
          state.actions = task.actions;
        }

        return state;
      };

      var createRecurrenceStateFromRRULE = function(rruleStr) {
        var recurrence = {};

        var rrule = RRule.parseString(rruleStr);
        recurrence.type = rrule.freq;
        recurrence.interval = rrule.interval;

        if (rrule.count) {
          recurrence.endType = 'after';
          recurrence.count = rrule.count;
        } else {
          recurrence.endType = 'never';
        }

        if (rrule.byweekday) {
          recurrence.weekDays = {
            'Mon': rrule.byweekday.indexOf(RRule.MO) > -1,
            'Tue': rrule.byweekday.indexOf(RRule.TU) > -1,
            'Wed': rrule.byweekday.indexOf(RRule.WE) > -1,
            'Thu': rrule.byweekday.indexOf(RRule.TH) > -1,
            'Fri': rrule.byweekday.indexOf(RRule.FR) > -1,
            'Sat': rrule.byweekday.indexOf(RRule.SA) > -1,
            'Sun': rrule.byweekday.indexOf(RRule.SU) > -1
          };
        } else {
          recurrence.weekDays = {};
        }

        if (rrule.freq === RRule.MONTHLY) {
          if (rrule.bymonthday) {
            recurrence.monthRepeatType = 'bymonthday';
            recurrence.dayOfMonth = {
              name: rrule.bymonthday.toString()
            };
          } else if (rrule.bysetpos) {
            recurrence.monthRepeatType = 'byweekday';
            recurrence.weekdayOfMonthIndex = rrule.bysetpos;
            recurrence.weekdayOfMonth = $scope.daysOfWeek[rrule.byweekday[0].weekday];
          }
        }

        if (rrule.freq === RRule.YEARLY) {
          if (rrule.bymonth && rrule.bymonthday) {
            recurrence.yearRepeatType = 'monthDay';
            recurrence.monthOfYear = monthsOfYear[rrule.bymonth - 1];
            recurrence.dayOfMonth = {
              name: rrule.bymonthday.toString()
            };
          }
        }

        return recurrence;
      };

      var createRRULEFromState = function(state) {
        var freq = parseInt(state.recurrence.type);
        if (freq > -1) {
          var options = {
            freq: freq,
            interval: state.recurrence.interval
          };

          // set byweekday
          if (freq === 2) {
            options.byweekday = [];
            if (state.recurrence.weekDays) {
              if (state.recurrence.weekDays.Mon) {
                options.byweekday.push(RRule.MO);
              }
              if (state.recurrence.weekDays.Tue) {
                options.byweekday.push(RRule.TU);
              }
              if (state.recurrence.weekDays.Wed) {
                options.byweekday.push(RRule.WE);
              }
              if (state.recurrence.weekDays.Thu) {
                options.byweekday.push(RRule.TH);
              }
              if (state.recurrence.weekDays.Fri) {
                options.byweekday.push(RRule.FR);
              }
              if (state.recurrence.weekDays.Sat) {
                options.byweekday.push(RRule.SA);
              }
              if (state.recurrence.weekDays.Sun) {
                options.byweekday.push(RRule.SU);
              }
            }
          }

          // set bymonthday
          if (freq === 1) {
            if (state.recurrence.monthRepeatType === 'bymonthday') {
              options.bymonthday = parseInt(state.recurrence.dayOfMonth.name);
            } else if (state.recurrence.monthRepeatType === 'byweekday') {
              options.bysetpos = parseInt(state.recurrence.weekdayOfMonthIndex);
              options.byweekday = [];
              if (state.recurrence.weekdayOfMonth.name === 'Monday') {
                options.byweekday.push(RRule.MO);
              } else if (state.recurrence.weekdayOfMonth.name === 'Tuesday') {
                options.byweekday.push(RRule.TU);
              } else if (state.recurrence.weekdayOfMonth.name === 'Wednesday') {
                options.byweekday.push(RRule.WE);
              } else if (state.recurrence.weekdayOfMonth.name === 'Thursday') {
                options.byweekday.push(RRule.TH);
              } else if (state.recurrence.weekdayOfMonth.name === 'Friday') {
                options.byweekday.push(RRule.FR);
              } else if (state.recurrence.weekdayOfMonth.name === 'Saturday') {
                options.byweekday.push(RRule.SA);
              } else if (state.recurrence.weekdayOfMonth.name === 'Sunday') {
                options.byweekday.push(RRule.SU);
              }
            }
          }

          // set byyearday
          if (freq === 0) {
            if (state.recurrence.yearRepeatType === 'monthDay') {
              options.bymonth = getMonthIndexByName(state.recurrence.monthOfYear.name);
              options.bymonthday = parseInt(state.recurrence.dayOfMonth.name);
            } else if (state.recurrence.yearRepeatType === 'monthRelativeWeekday') {
              options.bymonth = getMonthIndexByName(state.recurrence.monthOfYear.name);
              options.byday = '2TU';
            }
          }

          // set recurrence end
          if (state.recurrence.endType === 'after') {
            options.count = state.recurrence.count;
          } else if (state.recurrence.endType === 'ondate') {
            options.until = state.recurrence.endDate;
          }

          return new RRule(options).toString();
        }
        return null;
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

      var getMonthIndexByName = function(name) {
        for (var i=0; i < $scope.monthsOfYear.length; i++) {
          var o = $scope.monthsOfYear[i];
          if (o.name === name) {
            return i+1;
          }
        }
        return 0;
      };

      if (DialogContextService.getParams()) {
        $scope.topLevel = DialogContextService.getParams().topLevel;
      }

      // if a task was passed to the dialog, then we are updating an existing task so use it to generate state
      if (DialogContextService.getParams() && DialogContextService.getParams().task) {
        var task = DialogContextService.getParams().task;
        DialogContextService.clearParams();
        TasksService.getTask(task.links.self).then(function(fullTask) {
          $scope.mode = 'Edit';
          $scope.task = fullTask;
          $scope.state = $scope.createStateFromTask(fullTask);
        });
      // otherwise, we are creating a new task and should start with the default state
      } else {
        $scope.mode = 'Add';
        $scope.state = {
          name: null,
          provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
          startType: 'time',
          startDate: new Date(),
          startTime: new Date(),
          sunOffsetType: 'SR',
          sunOffsetMod: 1,
          sunOffsetValue: 0,
          recurrence: defaultRecurrence,
          event: {
            device: 'none',
            changeId: 'none'
          },
          actions: []
        };
      }
    }
  ]);
