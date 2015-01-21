'use strict';

angular.module('hobsonApp').
    factory('TasksService', ['$http', 'ApiService',
        function($http, ApiService) {

            var getTasks = function(uri, properties) {
              if (properties) {
                  uri += '?properties=true';
              }
              return $http.get(uri).then(function(response) {
                  return response.data;
              });
            };

            var getTask = function(uri) {
              return $http.get(uri).then(function(response) {
                return response.data;
              });
            };

            var addTask = function(task) {
                return ApiService.topLevel().then(function(topLevel) {
                    var json = angular.toJson(task);
                    return $http.post(topLevel.links.tasks, json);
                });
            };

            var updateTask = function(uri, task) {
                var json = angular.toJson(task);
                console.debug(json);
                return $http.put(uri, json);
            };

            var deleteTask = function(task) {
                return $http.delete(task.links.self);
            };

            return {
                getTasks: getTasks,
                getTask: getTask,
                addTask: addTask,
                updateTask: updateTask,
                deleteTask: deleteTask
            };
        }]);
