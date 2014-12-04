'use strict';

describe('Controller: TasksController', function () {

    // load the controller's module
    beforeEach(module('hobsonApp'));

    var tasksController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.debug('scope = ', scope);
        tasksController = $controller('TasksController', {
            $scope: scope
        });
    }));

    it('should attach an empty list of tasks to the scope', function () {
        expect(scope.tasks.length).toBe(0);
    });
});
