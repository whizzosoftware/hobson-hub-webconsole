'use strict';

angular.module('hobsonApp').
    controller('TasksController', ['$scope', 'AppData', 'TasksService', 'VariablesService', 'DialogContextService', '$modal', 'toastr',
        function($scope, AppData, TasksService, VariablesService, DialogContextService, $modal, toastr) {

            var setTasks = function(tasks) {
                console.debug('tasks = ', tasks);
                $scope.tasks = tasks;

                VariablesService.getGlobalVariables().then(function(results) {
                    console.debug('global variables', results);
                    console.debug(createDate(results.sunrise.value));
                    $scope.sunrise = createDate(results.sunrise.value).toLocaleTimeString();
                    $scope.sunset = createDate(results.sunset.value).toLocaleTimeString();
                });
            };

            var createDate = function(s) {
                if (s) {
                  // this is naively assuming that the date comes back in ISO8601 format for the local time zone
                  var d = new Date();
                  d.setHours(parseInt(s.substring(0, 2)));
                  d.setMinutes(parseInt(s.substring(3, 5)));
                  return d;
                } else {
                  return null;
                }
            };

            $scope.addTask = function() {
                var mi = $modal.open({
                    templateUrl: 'views/partials/add_task_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.deleteTask = function(task) {
                TasksService.deleteTask(task).then(function() {
                    toastr.info('The task has been deleted.');
                });
            };

            AppData.currentTab = 'tasks';
            $scope.tasks = [];

            $scope.loadingPromise = TasksService.getTasks(true);
            $scope.loadingPromise.then(setTasks);
        }]);
