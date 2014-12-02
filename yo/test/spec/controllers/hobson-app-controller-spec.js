'use strict';

describe('Controller: HobsonController', function () {

    // load the controller's module
    beforeEach(module('hobsonApp', 'pluginsFeed'));

    var apiJson,
        createHobsonController,
        createPluginsController,
        hobsonScope,
        pluginsScope,
        httpBackend,
        emptyJson,
        noUpdatesJson,
        oneUpdateJson,
        twoUpdatesJson,
        pluginsService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, ApiService, AppData, PluginsService, api, noUpdates, oneUpdate, twoUpdates, empty) {
        httpBackend = $httpBackend;
        apiJson = api;
        emptyJson = empty;
        noUpdatesJson = noUpdates;
        oneUpdateJson = oneUpdate;
        twoUpdatesJson = twoUpdates;
        hobsonScope = $rootScope.$new();
        pluginsScope = $rootScope.$new();

        createHobsonController = function () {
            return $controller('HobsonController', {
                '$scope': hobsonScope,
                'ApiService': ApiService,
                'AppData': AppData
            });
        };
        createPluginsController = function() {
            return $controller('PluginsController', {
                '$scope': hobsonScope,
                'AppData': AppData,
                'PluginsService': PluginsService
            });
        };
        pluginsService = PluginsService;

    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('Test HobsonController populated with no plugin updates', function () {
        createHobsonController();
        createPluginsController();

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').respond(noUpdatesJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        pluginsScope.$apply();
        hobsonScope.$apply();

        httpBackend.flush();

        expect(hobsonScope.numPluginUpdates).toBe(0);
    });

    it('Test HobsonController populated with empty results', function () {
        createHobsonController();
        createPluginsController();

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').respond(emptyJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        pluginsScope.$apply();
        hobsonScope.$apply();

        httpBackend.flush();

        expect(hobsonScope.numPluginUpdates).toBe(0);
        expect(hobsonScope.version).not.toBe(null);
    });

    it('Test HobsonController populated with one plugin update', function () {
        createHobsonController();
        createPluginsController();

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').respond(oneUpdateJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        pluginsScope.$apply();
        hobsonScope.$apply();

        httpBackend.flush();

        expect(hobsonScope.numPluginUpdates).toBe(1);
        expect(hobsonScope.version).not.toBe(null);
    });

    it('Test HobsonController populated with two plugin updates', function () {
        createHobsonController();
        createPluginsController();

        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local').respond(apiJson);
        httpBackend.expect('GET', '/api/v1/users/local/hubs/local/plugins?remote=true&details=true').respond(twoUpdatesJson);

        // calling $apply triggers $digest, which makes the HTTP requests
        pluginsScope.$apply();
        hobsonScope.$apply();

        httpBackend.flush();

        expect(hobsonScope.numPluginUpdates).toBe(2);
        expect(hobsonScope.version).not.toBe(null);
    });

});
