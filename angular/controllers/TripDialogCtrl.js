app.controller('TripDialogCtrl', ['$scope', '$mdDialog', 'authService', 'tripService', 'trip', function(
        $scope, $mdDialog, authService, tripService, trip) {

    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.trip = trip;
    $scope.isNew = trip._id == undefined;
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.accept = function () {
        if ((!trip.title || trip.title === '') &&
            (!trip.startDate || trip.startDate === '') &&
            (!trip.endDate || trip.endDate === '') &&
            (!trip.startDate <= trip.endDate)) {
            return;
        }
        if($scope.isNew){
            tripService.create(trip);
        }else{
            tripService.edit(trip);
        }
        $mdDialog.hide();

        //$scope.title = '';
        //$scope.startDate = '';
        //$scope.endDate = '';
    };
}]);
