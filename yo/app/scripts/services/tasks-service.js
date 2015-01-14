'use strict';

angular.module('hobsonApp').
    factory('TasksService', ['$http', 'ApiService',
        function($http, ApiService) {

            var getTasks = function(url, properties) {
              if (properties) {
                  url += '?properties=true';
              }
              return $http.get(url).then(function(response) {
                  return response.data;
              });
            };

            var addTask = function(task) {
                return ApiService.topLevel().then(function(topLevel) {
                    var json = angular.toJson(task);
                    return $http.post(topLevel.links.tasks, json);
                });
            };

            var deleteTask = function(task) {
                return $http.delete(task.links.self);
            };

            return {
                getTasks: getTasks,
                addTask: addTask,
                deleteTask: deleteTask
            };
        }]);
