'use strict';

angular.module('hobsonApp').
    controller('TasksController', ['$scope', '$interval', 'AppData', 'ApiService', 'TasksService', 'VariablesService', 'DialogContextService', '$modal', 'toastr',
        function($scope, $interval, AppData, ApiService, TasksService, VariablesService, DialogContextService, $modal, toastr) {
            var refreshInterval;

            var setTasks = function(tasks) {
                $scope.tasks = tasks;

                VariablesService.getGlobalVariables($scope.topLevel.links.globalVariables).then(function(results) {
                    if (results.sunrise.value) {
                      var date = createDate(results.sunrise.value);
                      $scope.sunrise = date.toLocaleTimeString().replace(/:\d{2}\s/,' ');
                    }
                    if (results.sunset.value) {
                      var date = createDate(results.sunset.value);
                      $scope.sunset = date.toLocaleTimeString().replace(/:\d{2}\s/,' ');
                    }
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

            /**
             * Opens the add task dialog.
             */
            $scope.addTask = function() {
                var mi = $modal.open({
                    templateUrl: 'views/partials/add_task_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.setParams({
                  topLevel: $scope.topLevel
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.editTask = function(task) {
              var mi = $modal.open({
                templateUrl: 'views/partials/add_task_dialog.html',
                size: 'lg',
                backdrop: 'static'
              });
              DialogContextService.setParams({
                topLevel: $scope.topLevel,
                task: task
              });
              DialogContextService.pushModalInstance(mi);
            };

            /**
             * Deletes a task from the list.
             *
             * @param task the task to remove
             */
            $scope.deleteTask = function(task) {
                TasksService.deleteTask(task).then(function() {
                    toastr.info('The task has been deleted.');
                    $scope.refresh();
                });
            };

            /**
             * Load the top-level API resource.
             */
            $scope.loadTopLevel = function() {
              ApiService.topLevel().then(function(topLevel) {
                $scope.topLevel = topLevel;
                // start a 5 second auto-refresh
                refreshInterval = $interval(function() {
                  $scope.refresh();
                }, 5000);
                $scope.refresh();
              });
            };

            /**
             * Refreshes the list of tasks.
             */
            $scope.refresh = function() {
              $scope.loadingPromise = TasksService.getTasks($scope.topLevel.links.tasks, true);
              $scope.loadingPromise.then(setTasks);
            };

            $scope.$on('$destroy', function() {
              // stop the 5 second auto refresh
              $interval.cancel(refreshInterval);
            });

            AppData.currentTab = 'tasks';
            $scope.tasks = [];
            $scope.topLevel = null;

            $scope.loadTopLevel();
        }]);
