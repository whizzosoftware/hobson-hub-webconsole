'use strict';

angular.module('hobsonApp').
    controller('TriggersController', ['$scope', 'AppData', 'TriggersService', 'DialogContextService', '$modal', 'toastr',
        function($scope, AppData, TriggersService, DialogContextService, $modal, toastr) {

            var setTriggers = function(triggers) {
                console.debug('triggers = ', triggers);
                $scope.triggers = triggers;
            };

            $scope.addTrigger = function() {
                var mi = $modal.open({
                    templateUrl: 'views/partials/add_trigger_dialog.html',
                    size: 'lg',
                    backdrop: 'static'
                });
                DialogContextService.pushModalInstance(mi);
            };

            $scope.deleteTrigger = function(trigger) {
                TriggersService.deleteTrigger(trigger).then(function() {
                    toastr.info('The trigger has been deleted.');
                });
            };

            AppData.currentTab = 'triggers';
            $scope.triggers = [];

            $scope.loadingPromise = TriggersService.getTriggers(true);
            $scope.loadingPromise.then(setTriggers);
        }]);
