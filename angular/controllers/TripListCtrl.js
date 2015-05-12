app.controller('TripListCtrl', ['$scope', '$state', 'LxDialogService', 'LxNotificationService', 'LxDatePickerService',
        'gettextCatalog', 'tripService', 'authService', function (
        $scope, $state, LxDialogService, LxNotificationService, LxDatePickerService,
        gettextCatalog, tripService, authService) {

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
        LxDatePickerService.handleClicks('add-trip-dialog');
    };

    $scope.closeAddDialog = function() {
        LxDatePickerService.endHandleClicks('add-trip-dialog');
    };

}]);
