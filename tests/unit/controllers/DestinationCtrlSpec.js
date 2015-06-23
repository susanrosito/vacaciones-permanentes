describe('DestinationCtrl', function() {
    var scope, controller;

    beforeEach(function() { module('vacacionesPermanentes'); });

    beforeEach(inject(function($controller, $rootScope, tripService) {
        scope = $rootScope.$new();
        var authServiceMock = {
            isLoggedIn: function() { return true; }
        };
        controller = $controller('DestinationCtrl', {
            $scope: scope,
            authService: authServiceMock,
            trip: new tripService.Trip(),
            destination: new tripService.Destination()
        });
    }));

    it('Call editMode makes editing destinations to be in editing mode', function() {
        scope.enterEditMode();
        expect(scope.editedDestination.isEditing).toBe(true);
    });

});
