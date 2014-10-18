'use strict';

/**
 * This service works around a problem caused by minification of the Angular Javascript. Rather than using an
 * in-line controller for managing modal dialogs (which creates injector name mangling problems), an ng-controller
 * directive is used in the dialog partial. This service solves the problem of how to pass parameters (and the
 * modalInstance) to the controller that is created.
 *
 * This is definitely not an elegant solution to the problem so any suggestions on improvement are welcome!
 */
angular.module('hobsonApp').
    factory('DialogContextService', [
        function() {
            var modalInstances = [];
            var params;

            var popModalInstance = function() {
                return modalInstances.pop();
            };

            var pushModalInstance = function(mi) {
                modalInstances.push(mi);

                // hook into the result promise so that we pop the modal instance regardless of how it is dismissed
                mi.result.finally(function() {
                    popModalInstance();
                });
            };

            var currentModalInstance = function() {
                console.debug(modalInstances);
                return modalInstances[modalInstances.length - 1];
            };

            var getParams = function() {
                return params;
            };

            var setParams = function(p) {
                params = p;
            };

            return {
                popModalInstance: popModalInstance,
                pushModalInstance: pushModalInstance,
                currentModalInstance: currentModalInstance,
                getParams: getParams,
                setParams: setParams
            };
        }]);
