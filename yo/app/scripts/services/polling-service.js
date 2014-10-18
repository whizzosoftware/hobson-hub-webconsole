'use strict';

angular.module('hobsonApp').
    factory('PollingService', ['$q', '$interval',
        function($q, $interval) {
            var promises = {};

            var guid = function() {
                function _p8(s) {
                    var p = (Math.random().toString(16) + '000000000').substr(2,8);
                    return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p ;
                }
                return _p8() + _p8(true) + _p8(true) + _p8();
            };

            var poll = function(validate, timeout) {
                // create a deferred object to return to the caller
                var deferred = $q.defer();

                // create a globally unique guid to store the promise
                var g = guid();

                // create the interval promise
                var promise = $interval(function() {
                    // perform the validate function call
                    validate().then(function(result) {
                        if (result === true) {
                            deferred.resolve();
                            if (promises[g] && promises[g].promise) {
                                $interval.cancel(promises[g].promise);
                            }
                        } else if (result === false) {
                            deferred.reject();
                            $interval.cancel(promises[g].promise);
                        }
                    });

                    // increment the interval count for timeout detection
                    promises[g].count++;
                }, 1000, timeout);

                // the finally function will detect a timeout and clean up the promises object
                promise.finally(function() {
                    // if the interval count == timeout, then the notify the caller of the timeout
                    if (promises[g].count === timeout) {
                        deferred.reject();
                    }
                    // remove the promise from the promises object
                    delete promises[g];
                });

                // store the promise under the guid we created
                promises[g] = {promise: promise, count: 0};

                // return the deferred object to the caller
                return deferred.promise;
            };

            return {
                poll: poll
            };
        }]);
