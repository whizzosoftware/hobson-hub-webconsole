'use strict';

angular.module('hobsonApp').
    controller('TasksController', ['$scope', 'AppData', 'TasksService', 'DialogContextService', '$modal', 'toastr',
        function($scope, AppData, TasksService, DialogContextService, $modal, toastr) {

            var setTasks = function(tasks) {
                console.debug('tasks = ', tasks);
                $scope.tasks = tasks;
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
