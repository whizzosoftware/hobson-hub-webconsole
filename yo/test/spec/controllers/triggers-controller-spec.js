'use strict';

describe('Controller: TriggersController', function () {

    // load the controller's module
    beforeEach(module('hobsonApp'));

    var triggersController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.debug('scope = ', scope);
        triggersController = $controller('TriggersController', {
            $scope: scope
        });
    }));

    it('should attach an empty list of triggers to the scope', function () {
        expect(scope.triggers.length).toBe(0);
    });
});
