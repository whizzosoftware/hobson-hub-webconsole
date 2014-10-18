'use strict';

angular.module('hobsonApp').
    controller('VideoViewDialogController', ['$scope', 'AppData', 'DialogContextService',
        function($scope, AppData, DialogContextService) {
            $scope.deviceName = DialogContextService.getParams().deviceName;
            $scope.videoUrl = DialogContextService.getParams().videoUrl;

            $scope.close = function() {
                DialogContextService.currentModalInstance().dismiss();
            };
        }]);
