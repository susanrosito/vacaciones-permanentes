describe('TripListCtrl', function() {
    var scope, controller, tripList;

    beforeEach(function() { module('vacacionesPermanentes'); });

    beforeEach(inject(function($controller, $rootScope, tripService) {
        scope = $rootScope.$new();
        var authServiceMock = {
            isLoggedIn: function() { return true; }
        };
        tripList = [
            new tripService.Trip({ title: 'Neverland' }),
            new tripService.Trip({ title: 'Wonderland' }),
            new tripService.Trip({ title: 'Smallville' }),
            new tripService.Trip({ title: 'Tatooine' })
        ];
        var tripServiceMock = {
            all: [],
            Trip: tripService.Trip,
            Destination: tripService.Destination,
            getAll: function() {
                this.all = tripList;
                return this.all;
            }
        };
        controller = $controller('TripListCtrl', {
            $scope: scope,
            authService: authServiceMock,
            tripService: tripServiceMock
        });
    }));

    it('Fetch all trips returns tripService getAll results', function() {
        expect(scope.trips).toEqual(tripList);
    });

});

