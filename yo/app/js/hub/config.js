// Filename: config.js
require.config({
        deps: [
        	'main'
        ],
        paths: {
                'authFailHandler': '../authFailHandler',
                'backbone': '../../bower_components/backbone/backbone',
                'backbone.validation': '../../bower_components/backbone.validation/dist/backbone-validation-amd',
                'backbone.stickit': '../../bower_components/backbone.stickit/backbone.stickit',
                'base64': '../../bower_components/base-64/base64',
                'bridget': '../../bower_components/jquery-bridget/jquery.bridget',
                'chartist': '../../bower_components/chartist/dist/chartist.min',
                'chartistTooltip': '../../bower_components/chartist-plugin-tooltip/dist/chartist-plugin-tooltip.min',
                'cookies': '../../bower_components/cookies-js/dist/cookies.min',
                'datetimepicker': '../../bower_components/datetimepicker/jquery.datetimepicker',
                'dropzone': '../../bower_components/dropzone/dist/dropzone-amd-module',
                'foundation.core': '../../bower_components/foundation/js/foundation.min',
                'foundation.dropdown': '../../bower_components/foundation/js/foundation/foundation.dropdown',
                'gridster': '../../bower_components/gridster-js/dist/jquery.gridster.min',
                'i18n': '../../bower_components/requirejs-i18n/i18n',
                'jquery': '../../bower_components/jquery/dist/jquery.min',
                'jquery-colpick': '../../bower_components/jquery-colpick/js/colpick',
                'masonry': '../../bower_components/masonry/dist/masonry.pkgd.min',
                'models': '../models',
                'modernizr': '../../bower_components/foundation/js/vendor/modernizr',
                'moment': '../../bower_components/moment/min/moment.min',
                'nlp': '../../bower_components/rrule/lib/nlp',
                'nls': '../nls',
                'rrule': '../../bower_components/rrule/lib/rrule',
                'services': '../services',
                'sidr': '../../bower_components/sidr/dist/jquery.sidr',
                'spin': '../../bower_components/ladda/dist/spin.min',
                'templates': '../../templates',
                'text': '../../bower_components/requirejs-text/text',
                'toastr': '../../bower_components/toastr/toastr.min',
                'underscore': '../../bower_components/underscore/underscore-min'
        },
        shim: {
                'foundation.core': {
                        deps: [
                                'jquery',
                                'modernizr'
                        ],
                        exports: 'Foundation'
                },
                'foundation.dropdown': {
                        deps: [
                                'foundation.core'
                        ]
                },
                'modernizr': {
                        exports: 'Modernizer'
                },
                'nlp': {
                        deps: ['rrule']
                },
                'sidr': {
                        deps: ['jquery']
                },
                'chartistTooltip': {
                        deps: ['chartist']
                },
                'gridster': {
                        deps: ['jquery']
                }
        },
        enforceDefine: false
});
