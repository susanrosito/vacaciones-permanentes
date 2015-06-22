describe('TripListCtrl', function() {
    var scope, controller;

    beforeEach(function() {
        module('vacacionesPermanentes');
    });

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        var authServiceMock = {
            isLoggedIn: function() { return true; }
        };
        var tripServiceMock = {
            all: [],
            Trip: function() {},
            getAll: function() {
                this.all = [1, 2, 3, 4];
                return this.all;
            }
        };
        controller = $controller('TripListCtrl', {
            $scope: scope,
            authService: authServiceMock,
            tripService: tripServiceMock
        });
    }));

    it('Fetch all trips returns tripService getAll', function() {
        expect(scope.trips).toEqual([1, 2, 3, 4]);
    });
});
