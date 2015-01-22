'use strict';

angular.module('hobsonApp').
    controller('VideoViewDialogController', ['$scope', '$http', 'AppData', 'DialogContextService',
        function($scope, $http, AppData, DialogContextService) {
            $scope.deviceName = DialogContextService.getParams().deviceName;
            var videoUrl = DialogContextService.getParams().videoUrl;
            $http.head(videoUrl).success(function() {
              $scope.videoUrl = videoUrl;
            }).error(function(data, status, headers, config) {
              if (status === 401) {
                $scope.error = 'Hobson is not authorized to access this device\'s stream. Please make sure you have entered the correct username and password in the device\'s settings.';
              } else {
                $scope.error = 'An error occurred accessing this device\'s stream. Please see the log for details.';
              }
            });

            $scope.close = function() {
                DialogContextService.currentModalInstance().dismiss();
            };
        }]);
