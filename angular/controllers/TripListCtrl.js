app.controller('TripListCtrl', ['$scope', '$state', 'LxDialogService', 'LxNotificationService',
        'gettextCatalog', 'tripService', 'authService', function (
        $scope, $state, LxDialogService, LxNotificationService,
        gettextCatalog, tripService, authService) {


    function avoidOpeningTwoDatePickers(ev) {
        if (!angular.element('.lx-date-picker--is-shown').length == 0) {
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }
    }

    if (authService.isLoggedIn() && tripService.all.length === 0) {
        tripService.getAll();
    }
    $scope.trips = tripService.all;
    $scope.newTrip = new tripService.Trip();
    $scope.newTrip.create = function () {
        tripService.create(this).success(function(trip) {
            LxDialogService.close('add-trip-dialog');
            $state.go('trip', {id: trip._id});
        }).error(function(error) {
            LxNotificationService.error(gettextCatalog.getString(error.message));
        });
    };

    $scope.showAddDialog = function (ev) {
        LxDialogService.open('add-trip-dialog');
        $scope.newTrip.resetTo(new tripService.Trip());
        angular.element('#add-trip-dialog')[0].addEventListener('click', avoidOpeningTwoDatePickers, true);
    };

    $scope.closeAddDialog = function() {
        angular.element('#add-trip-dialog')[0].removeEventListener('click', avoidOpeningTwoDatePickers, true);
    };

}]);
