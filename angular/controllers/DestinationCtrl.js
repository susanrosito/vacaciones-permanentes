app.controller('DestinationCtrl', ['$scope', '$state', 'LxNotificationService',
    'gettextCatalog', 'authService', 'tripService', 'trip', 'destination', function (
            $scope, $state, LxNotificationService, gettextCatalog, authService, tripService, trip, destination) {

        if (authService.isLoggedIn() && tripService.all.length ===0) {
            tripService.getAll();
        }

        $scope.trips = tripService.all;
        $scope.trip = trip;
        $scope.destination = destination;

        $scope.editedDestination = new tripService.Destination($scope.destination);
        $scope.editedDestination.isEditing = false;
        $scope.tempPOI = new tripService.POI();
        $scope.isAddPOIshowned = false;

        $scope.enterEditMode = function() {
            $scope.editedDestination.isEditing = true;
        };

        $scope.cancelEdit = function() {
            $scope.editedDestination.resetTo($scope.destination);
            $scope.editedDestination.isEditing = false;
            $state.go('destination', {id: $scope.trip._id, destinationId: $scope.destination._id});
            // $scope.mapData.loadDestinations($scope.trip);
        };

        $scope.confirmEdit = function() {
            $scope.cancelEdit();
            tripService.updateDestination($scope.trip, $scope.editedDestination).success(function(){
                $state.go('destination', {id: $scope.trip._id, destinationId: $scope.destination._id},
                        {reload: true});
            });

        };

        $scope.showAddPOIBox = function () {
            $scope.isAddPOIshowned = true;
            $scope.tempPOI.resetTo(new tripService.POI());
        };

        $scope.closeAddPOIBox = function() {
            $scope.isAddPOIshowned = false;
        };

        $scope.addPOI = function(poi) {
            $scope.editedDestination.addPOI($scope.tempPOI.clone());
            // $scope.mapData.loadDestinations($scope.editedTrip);
            $scope.tempPOI.resetTo(new tripService.POI());
            $scope.isAddPOIshowned = false;
        };

        $scope.removePOI = function(poi) {
            $scope.editedDestination.removePOI(poi);
            // $scope.mapData.loadDestinations($scope.editedDestination);
        };
}]);