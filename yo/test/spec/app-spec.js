'use strict';

describe('App: HobsonApp', function () {

    var fixtures = [
        'AWAITING DISPATCH',
        'AWAITING_DISPATCH',
        'AWaiTing-DISPatcH',
        'Awaiting DISPATCH'
    ];

    // load the controller's module
    beforeEach(module('hobsonApp'));

    it('should convert strings correctly', inject(function(titleCaseFilter) {

        fixtures.forEach(function(fixture) {
            console.debug('fixture = ', fixture);
            expect(titleCaseFilter(fixture)).toEqual('Awaiting Dispatch');
        });

    }));

    it('should return an empty string when a value is not passed', inject(function(titleCaseFilter) {
        expect(titleCaseFilter()).toEqual('');
        expect(titleCaseFilter(null)).toEqual('');
    }));
});
