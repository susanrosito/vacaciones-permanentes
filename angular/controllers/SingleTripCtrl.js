app.controller('SingleTripCtrl', ['$scope', '$http', '$state', '$stateParams', '$mdDialog', 'tripService', 'trip', function (
    $scope, $http, $state, $stateParams, $mdDialog, tripService, trip) {

    $scope.trips = tripService.all;
    $scope.trip = trip;

    $scope.showAddDialog = function (ev) {
        $mdDialog.show({
            controller: 'AddTripDialogCtrl',
            templateUrl: '/partials/addTrip.html',
            targetEvent: ev
        }).then(function (answer) {}, function () {
            $mdDialog.hide();
        });
    };


    $scope.showDeleteDialog = function (ev) {
        $mdDialog.show($mdDialog.confirm()
            .title('Would you like to delete this trip?')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev)
        ).then(function (answer) {
                tripService.delete($scope.trip);
                $mdDialog.hide();
                $state.go('home');
        }, function () {
                $mdDialog.hide();
        });
    };

    //$scope.deleteTrip = function (trip) {
    //   tripService.delete(trip)
    //};

}]);
