'use strict';

angular.module('hobsonApp').
    controller('LogViewerDialogController', ['$scope', 'AppData', 'SettingsService', 'DialogContextService', 'toastr',
        function($scope, AppData, SettingsService, DialogContextService, toastr) {

            $scope.log = '';

            $scope.close = function () {
                DialogContextService.currentModalInstance().dismiss();
            };

            SettingsService.getLog().then(function(result) {
                $scope.log = result.data;
            }, function() {
                toastr.error('An error occurred retrieving the log.', null, {
                    closeButton: true
                });
            });
        }]);
