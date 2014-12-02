'use strict';

describe('Controller: PluginsController', function () {

    // load the controller's module
    beforeEach(module('hobsonApp', 'pluginsFeed'));

    var apiJson,
        createController,
        scope,
        httpBackend,
        interval,
        emptyJson,
        noUpdatesJson,
        oneUpdateJson,
        oneUpdateNotUpdatedJson,
        oneUpdateUpdatedJson,
        twoUpdatesJson,
        pluginsService,
        q;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $interval, $q,
                                AppData, PluginsService, api, noUpdates, oneUpdate, oneUpdateNotUpdated,
                                oneUpdateUpdated, twoUpdates, empty) {
        httpBackend = $httpBackend;
        interval = $interval;
        apiJson = api;
        emptyJson = empty;
        noUpdatesJson = noUpdates;
        oneUpdateJson = oneUpdate;
        oneUpdateNotUpdatedJson = oneUpdateNotUpdated;
        oneUpdateUpdatedJson = oneUpdateUpdated;
        twoUpdatesJson = twoUpdates;
        scope = $rootScope.$new();
        q = $q;

        createController = function() {
            return $controller('PluginsController', {
                '$scope': scope,
                '$q': q,
                'AppData': AppData,
                'PluginsService': PluginsService
            });
        };
        pluginsService = PluginsService;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('populate scope with installed and available plugins', function () {
        createController();
        console.debug('scope = ', scope);
        console.debug('scope.installed = ', scope.installed);
        console.debug('scope.available = ', scope.available);

        expect(scope.installed.length).toBe(0);
        expect(scope.available.length).toBe(0);

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').
            respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').
            respond(noUpdatesJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        scope.$apply();

        httpBackend.flush();

        console.debug('scope.installed = ', scope.installed);
        console.debug('scope.available = ', scope.available);
        expect(scope.installed.length).toBe(1);
        expect(scope.available.length).toBe(2);
        expect(pluginsService.failed().length).toBe(1);
        expect(scope.numUpdatesAvailable).toBe(0);
        scope.installed.forEach(function(i) {
            expect(i.links.update).toBe(undefined);
        });

        console.debug('===========================================================');
        // TODO: work out how to test setting boolean true and testing the filter.
        // Below is an attempt by setting scope.includeFrameworkPlugins to true.  Perhaps
        // it is better to have the filter be defined at app level and test directly
        // but then can't test controller interaction.
//        scope.$apply(function() {
//            console.debug('calling scope.filterPlugin()');
//            scope.includeFrameworkPlugins = true;
//        });
//        expect(scope.installed.length).toBe(4);
//        expect(scope.available.length).toBe(2);
    });

    it('test controller with empty response', function () {
        createController();

        expect(scope.installed.length).toBe(0);
        expect(scope.available.length).toBe(0);

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').
            respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').
            respond(emptyJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        scope.$apply();

        httpBackend.flush();

        expect(scope.installed.length).toBe(0);
        expect(scope.available.length).toBe(0);

    });

    it('test controller with one plugin update response', function () {
        createController();

        expect(scope.installed.length).toBe(0);
        expect(scope.available.length).toBe(0);

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').respond(oneUpdateJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        scope.$apply();

        httpBackend.flush();

        expect(scope.installed.length).toBe(1);
        expect(scope.available.length).toBe(0);
        expect(scope.numUpdatesAvailable).toBe(1);
        expect(pluginsService.numUpdates()).toBe(1);
        expect(pluginsService.failed().length).toBe(0);
        expect(scope.availableMsg).toBe('There is 1 plugin update available.');
        scope.installed.forEach(function(i) {
            expect(i.links.update).not.toBe(undefined);
        });
    });

    it('test controller with multiple plugin updates response', function () {
        createController();

        expect(scope.installed.length).toBe(0);
        expect(scope.available.length).toBe(0);

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').respond(twoUpdatesJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        scope.$apply();

        httpBackend.flush();

        expect(scope.installed.length).toBe(2);
        expect(scope.available.length).toBe(0);
        expect(scope.numUpdatesAvailable).toBe(2);
        expect(pluginsService.numUpdates()).toBe(2);
        expect(pluginsService.failed().length).toBe(0);
        expect(scope.availableMsg).toBe('There are 2 plugin updates available.');
        scope.installed.forEach(function(i) {
            expect(i.links.update).not.toBe(undefined);
        });
    });

    /*
    it('simulated test of controller when updating a plugin', function () {
        // test actually drives at the service layer because it was too
        // difficult to go in at controller layer, simulate the interval
        // timer and not have angular $digest() loop already in progress
        // exception get thrown.
        httpBackend.
            expect('POST', '/api/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/update').
            respond(202, null, {location: '/api/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/currentVersion'});
        httpBackend.expect('GET', '/api/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/currentVersion').respond(oneUpdateNotUpdatedJson);
        httpBackend.expect('GET', '/api/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/currentVersion').respond(oneUpdateUpdatedJson);
        var plugin = oneUpdateJson[0];
        pluginsService.update(plugin).then(function(location) {
            console.debug('location = ', location);
            pluginsService.checkUpdate(plugin, location, plugin.latestVersion).then(function (updated) {
                console.debug('updated = ', updated);
                expect(updated).toBe(false);
                pluginsService.checkUpdate(plugin, location, plugin.latestVersion).then(function (updated) {
                    console.debug('updated = ', updated);
                    expect(updated).toBe(true);
                });
            });
        });

        console.debug('interval.flush(102): interval = ', interval);
        httpBackend.flush();
    });
    */
});
