// Filename: config.js
require.config({
        deps: [
        	'main'
        ],
        paths: {
                'backbone': '../bower_components/backbone/backbone',
                'base64': '../bower_components/base-64/base64',
                'bridget': '../bower_components/jquery-bridget/jquery.bridget',
                'chartist': '../bower_components/chartist/dist/chartist',
                'cookies': '../bower_components/cookies-js/dist/cookies',
                'datetimepicker': '../bower_components/datetimepicker/jquery.datetimepicker',
                'dropzone': '../bower_components/dropzone/dist/dropzone-amd-module',
                'foundation.core': '../bower_components/foundation/js/foundation',
                'foundation.reveal': '../bower_components/foundation/js/foundation/foundation.reveal',
                'foundation.accordion': '../bower_components/foundation/js/foundation/foundation.accordion',
                'foundation.dropdown': '../bower_components/foundation/js/foundation/foundation.dropdown',
                'foundation.topbar': '../bower_components/foundation/js/foundation/foundation.topbar',
                'highcharts': '../bower_components/highcharts-release/highcharts',
                'i18n': '../bower_components/requirejs-i18n/i18n',
                'jquery': '../bower_components/jquery/dist/jquery',
                'jquery-colpick': '../bower_components/jquery-colpick/js/colpick',
                'ladda': '../bower_components/ladda/dist/ladda.min',
                'marionette': '../bower_components/marionette/lib/backbone.marionette',
                'masonry': '../bower_components/masonry/dist/masonry.pkgd.min',
                'modernizr': '../bower_components/foundation/js/vendor/modernizr',
                'moment': '../bower_components/moment/moment',
                'sidr': '../bower_components/sidr/jquery.sidr.min',
                'spin': '../bower_components/ladda/dist/spin.min',
                'templates': '../templates',
                'text': '../bower_components/requirejs-text/text',
                'toastr': '../bower_components/toastr/toastr.min',
                'underscore': '../bower_components/underscore/underscore'
        },
        shim: {
                'foundation.core': {
                        deps: [
                                'jquery',
                                'modernizr'
                        ],
                        exports: 'Foundation'
                },
                'foundation.reveal': {
                        deps: [
                                'foundation.core'
                        ]
                },
                'foundation.accordion': {
                        deps: [
                                'foundation.core'
                        ]
                },
                'foundation.dropdown': {
                        deps: [
                                'foundation.core'
                        ]
                },
                'foundation.topbar': {
                        deps: [
                                'foundation.core'
                        ]
                },
                'modernizr': {
                        exports: 'Modernizer'
                },
                'highcharts': {
                        exports: 'Highcharts'
                }
        },
        enforceDefine: false
});
define();