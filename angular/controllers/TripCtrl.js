app.controller('TripCtrl', ['$scope', '$http', '$stateParams', '$mdDialog', 'tripService', function (
        $scope, $http, $stateParams, $mdDialog, tripService) {

    $scope.trips = tripService.all;

    $scope.showAddDialog = function (ev) {
        $mdDialog.show({
            controller: 'TripDialogCtrl',
            templateUrl: '/partials/trip.html',
            targetEvent: ev,
            locals: { trip: {} }
        }).then(function (answer) {}, function () {
            $mdDialog.hide();
        });
    };
    
}]);
