'use strict';

angular.module('hobsonApp').
    controller('ImageViewDialogController', ['$scope', '$interval', 'AppData', 'DialogContextService',
        function($scope, $interval, AppData, DialogContextService) {
            $scope.deviceName = DialogContextService.getParams().deviceName;
            $scope.imageUrl = DialogContextService.getParams().imageUrl;
            $scope.lastUpdated = new Date();

            /**
             * Force the image to refresh
             */
            var refresh = function() {
                $scope.imageUrl = DialogContextService.getParams().imageUrl + '#' + new Date().getTime();
                $scope.lastUpdated = new Date();
            };

            /**
             * Dismiss the configuration dialog.
             */
            $scope.close = function() {
                DialogContextService.currentModalInstance().dismiss();
            };

            var promise = $interval(function() {
                refresh();
            }, 5000);

            DialogContextService.currentModalInstance().result.finally(function() {
                $interval.cancel(promise);
            });
        }]);
