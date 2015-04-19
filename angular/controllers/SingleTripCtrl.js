app.controller('SingleTripCtrl', ['$scope', '$http', '$stateParams', '$mdDialog', 'tripService', 'trip', function (
    $scope, $http, $stateParams, $mdDialog, tripService, trip) {

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
}]);
