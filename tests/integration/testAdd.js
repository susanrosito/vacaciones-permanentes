require('./testRunner');

describe('Add new trip', function() {

    it('should add a trip', function() {
        loggedIn(function() {
            var trips = element.all(by.repeater('trip in trips'));
            expect(trips.count()).toEqual(2);
        });
    });
});
