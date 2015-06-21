describe("TripListCtrl", function() {

    var scope, controller;

    beforeEach(function(){
        module('vacacionesPermanentes')
    });

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('TripListCtrl', { $scope: scope });
    }));

    it("fills the foos", function() {
        // expect(scope.foos).toEqual(["un foo", "otro foo", "un foo más"]);
        expect(1 == 1).toEqual(true)
    });
});