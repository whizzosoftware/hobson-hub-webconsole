'use strict';

angular.module('hobsonApp').
    controller('AddTriggerController', ['$scope', '$filter', 'AppData', 'TriggersService', 'DialogContextService', '$modal', 'toastr', 'monthsOfYear', 'daysOfWeek', 'daysOfMonth',
        function($scope, $filter, AppData, TriggersService, DialogContextService, $modal, toastr, monthsOfYear, daysOfWeek, daysOfMonth) {
            $scope.monthsOfYear = monthsOfYear;
            $scope.daysOfWeek = daysOfWeek;
            $scope.daysOfMonth = daysOfMonth;

            $scope.recurrence = {
                rule: {},
                repeat: -1,
                end: 'never',
                interval: 1,
                count: 30,
                startDate: new Date(),
                endDate: new Date()
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

            var updateRRULE = function() {
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

            $scope.trigger = {
                provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
                actions: [
                ]
            };

            $scope.add = function() {
                // update the recurrence rule
                updateRRULE();

                // create the trigger conditions
                var condition = {
                    start: $filter('date')($scope.recurrence.startDate, 'yyyyMMddTHHmmssZ')
                };

                // if a recurrence rule is defined, add it to the conditions
                if ($scope.recurrence.rule) {
                    condition.recurrence = $scope.recurrence.rule.toString();
                }

                $scope.trigger.conditions = new Array(condition);

                TriggersService.addTrigger($scope.trigger).then(function() {
                    toastr.info('The trigger has been created.');
                    DialogContextService.popModalInstance().dismiss();
                    // TODO: refresh UI
                });
            };

            $scope.cancel = function() {
                DialogContextService.currentModalInstance().dismiss();
            };

            $scope.addAction = function() {
                DialogContextService.setParams({trigger: $scope.trigger});
                var mi = $modal.open({
                    templateUrl: 'views/partials/add_action_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.removeAction = function(index) {
                $scope.trigger.actions.splice(index,1);
            };
        }
    ]);
