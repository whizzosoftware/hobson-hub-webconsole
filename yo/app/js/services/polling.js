// Filename: services/polling.js
define([
    'jquery',
], function($) {
    var PollingService = {

        poll: function(options) {
            if (!options.interval) {
                options.interval = 1000;
            }
            var count = 0;
            var i = setInterval(function() {
                if (count < 5) {
                    $.ajax(options.url, {
                        success: function(json) {
                            if (options.check(options.context, json)) {
                                clearInterval(i);
                                options.success(options.context);
                            } else {
                                count++;
                            }
                        },
                        error: function() {
                            clearInterval(i);
                            options.failure(options.context);
                        }
                    });
                } else {
                    clearInterval(i);
                    options.failure(options.context);
                }
            }, options.interval);
        }
    }

    return PollingService;
});