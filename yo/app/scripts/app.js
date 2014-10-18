'use strict';

/**
 * @ngdoc overview
 * @name hobsonApp
 * @description
 * # hobsonApp
 *
 * Main module of the application.
 */
angular.module('hobsonApp', [
    'ui.bootstrap',
    'ngAnimate',
    'ngLocale',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'cgBusy',
    'formly',
    'angularSpectrumColorpicker',
    'nouislider',
    'toastr',
    'ngQuickDate',
    'angular-ladda'
]).
config(function ($routeProvider) {
    $routeProvider.
        when('/triggers', {
            templateUrl: 'views/partials/triggers.html',
            controller: 'TriggersController'
        }).
        when('/plugins', {
            templateUrl: 'views/partials/plugins.html',
            controller: 'PluginsController'
        }).
        when('/devices', {
            templateUrl: 'views/partials/devices.html',
            controller: 'DevicesController'
        }).
        when('/settings', {
            templateUrl: 'views/partials/settings.html',
            controller: 'SettingsController'
        }).
        when('/', {
            templateUrl: 'views/partials/plugins.html',
            controller: 'PluginsController'
        }).
        otherwise({
            redirectTo: '/'
        });
}).
/**
 * Service to get the top-level API entry points.  The service
 * has one method, topLevel, which returns a promise to links
 * for accessing the rest of the API.
 */
factory('ApiService', ['$http',
    function($http) {
        var topLevel = function() {
            var promise = $http.get('/api/v1').then(function (response) {
                console.debug('AppService.topLevel(): response.data = ', response.data);
                return response.data;
            });
            return promise;
        };

        return {
            topLevel: topLevel
        };
    }]).
/**
 * Service to access/mutate app level data.
 */
factory('AppData', [
    function() {
        var currentTab;

        return {
            currentTab: currentTab
        };
    }
]).
/**
 * Filter to capitalize first letter in each word of the input string taken
 * from https://gist.github.com/maruf-nc/5625869
 */
filter('titleCase', function() {
    return function(str) {
        return (str === undefined || str === null) ? '' : str.replace(/_|-/, ' ').replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
}).
controller('HobsonController', ['$scope', 'ApiService', 'AppData',
    function($scope, ApiService, AppData) {
        $scope.version = '';
        $scope.$on('NUM_PLUGINS', function(event, numUpdates) {
            console.debug('$scope.$on(): numPluginUpdates = ', numUpdates);
            $scope.numPluginUpdates = numUpdates;
        });
        console.debug('numPluginUpdates = ', $scope.numPluginUpdates);
        ApiService.topLevel().then(function(topLevel) {
            $scope.version = topLevel.version;
        });

        $scope.tab = function(clickedTab) {
            if (clickedTab) {
                AppData.currentTab = clickedTab;
            }
            return AppData.currentTab;
        };
    }
]).
constant('monthsOfYear', [
    {name: 'January'},
    {name: 'February'},
    {name: 'March'},
    {name: 'April'},
    {name: 'May'},
    {name: 'June'},
    {name: 'July'},
    {name: 'August'},
    {name: 'September'},
    {name: 'October'},
    {name: 'November'},
    {name: 'December'}
]).
constant('daysOfWeek', [
    {name: 'Monday'},
    {name: 'Tuesday'},
    {name: 'Wednesday'},
    {name: 'Thursday'},
    {name: 'Friday'},
    {name: 'Saturday'},
    {name: 'Sunday'}
]).
constant('daysOfMonth', [
    {name: '1'},
    {name: '2'},
    {name: '3'},
    {name: '4'},
    {name: '5'},
    {name: '6'},
    {name: '7'},
    {name: '8'},
    {name: '9'},
    {name: '10'},
    {name: '11'},
    {name: '12'},
    {name: '13'},
    {name: '14'},
    {name: '15'},
    {name: '16'},
    {name: '17'},
    {name: '18'},
    {name: '19'},
    {name: '20'},
    {name: '21'},
    {name: '22'},
    {name: '23'},
    {name: '24'},
    {name: '25'},
    {name: '26'},
    {name: '27'},
    {name: '28'},
    {name: '29'},
    {name: '30'},
    {name: '31'}
]).directive('mjpeg', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<span></span>',
        scope: {
            'url': '='
        },
        link: function (scope, element) {
            scope.$watch('url', function (newVal) {
                if (newVal) {
                    var iframe = document.createElement('iframe');
                    iframe.setAttribute('width', '100%');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('scrolling', 'no');
                    element.replaceWith(iframe);

                    var iframeHtml = '<html><head><base target="_parent" /><style type="text/css">html, body { margin: 0; padding: 0; height: 100%; width: 100%; }</style><script> function resizeParent() { var ifs = window.top.document.getElementsByTagName("iframe"); for (var i = 0, len = ifs.length; i < len; i++) { var f = ifs[i]; var fDoc = f.contentDocument || f.contentWindow.document; if (fDoc === document) { f.height = 0; f.height = document.body.scrollHeight; } } }</script></head><body onresize="resizeParent()"><img src="' + newVal + '" style="width: 100%; height: auto" onload="resizeParent()" /></body></html>';

                    var doc = iframe.document;
                    if (iframe.contentDocument) {
                        doc = iframe.contentDocument;
                    }
                    else if (iframe.contentWindow) {
                        doc = iframe.contentWindow.document;
                    }

                    doc.open();
                    doc.writeln(iframeHtml);
                    doc.close();
                } else {
                    element.html('<span></span>');
                }
            }, true);
        }
    };
});