app.controller('TripCtrl', ['$scope', '$http', '$stateParams', '$mdDialog', 'tripService', function (
        $scope, $http, $stateParams, $mdDialog, tripService) {

    $scope.trips = tripService.all;

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
