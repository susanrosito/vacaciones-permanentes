app.controller('TripCtrl', ['$scope', '$state', 'LxNotificationService', 'LxDialogService', 'LxDatePickerService',
    'gettextCatalog', 'authService', 'tripService', 'trip', function (
    $scope, $state, LxNotificationService, LxDialogService, LxDatePickerService, gettextCatalog, authService, tripService, trip) {

    if (authService.isLoggedIn() && tripService.all.length ===0) {
        tripService.getAll();
    }

    $scope.trips = tripService.all;
    $scope.trip = trip;


    $scope.editedTrip = new tripService.Trip();
    $scope.editedTrip.resetTo($scope.trip);
    $scope.editedTrip.isEditing = false;
    $scope.tempDestination = new tripService.Destination();
    $scope.polyline = new google.maps.Polyline({
        strokeColor: '#6060FB',
        strokeOpacity: 1.0,
        geodesic: true,
        strokeWeight: 3
    });
    setTimeout(function() { LxDatePickerService.disableAll() }, 1000);
    // In display mode, will display the current trip


    $scope.enterEditMode = function() {
        LxDatePickerService.enableAll();
        $scope.editedTrip.isEditing = true;
    };

    $scope.cancelEdit = function() {
        $scope.editedTrip.resetTo($scope.trip);
        $state.go('trip', {id: $scope.trip._id})
        LxDatePickerService.disableAll();
        $scope.editedTrip.isEditing = false;
        $scope.loadDestinationsInMap($scope.trip);
    };

    $scope.confirmEdit = function() {
        tripService.update($scope.editedTrip);
        $scope.trip.resetTo($scope.editedTrip);
        LxDatePickerService.disableAll();
        $scope.editedTrip.isEditing = false;
        $scope.loadDestinationsInMap($scope.trip);
    };

    $scope.confirmDelete = function() {
        LxNotificationService.confirm(gettextCatalog.getString('Delete Trip'),
            gettextCatalog.getString('Are you sure you want to delete the trip') + ' "' +
            trip.title + '"', {
                cancel:gettextCatalog.getString('Cancel'),
                ok:gettextCatalog.getString('Confirm')
            }, function(answer) {
                if (answer) {
                    tripService.remove($scope.trip);
                    $state.go('home');
                }
            });
    };

    $scope.showAddDestinationDialog = function (ev) {
        LxDialogService.open('add-destination-dialog');
        $scope.tempDestination.resetTo(new tripService.Destination());
        LxDatePickerService.handleClicks('add-destination-dialog');
    };

    $scope.closeAddDestinationDialog = function() {
        LxDatePickerService.endHandleClicks('add-destination-dialog');

    };

    $scope.addDestination = function(destination) {
        var dest = new tripService.Destination();
        dest.resetTo($scope.tempDestination);
        dest = $scope.addLatLongToDestination(dest);
        $scope.editedTrip.addDestination(dest);
        $scope.loadDestinationsInMap($scope.editedTrip);
        $scope.tempDestination.resetTo(new tripService.Destination());
        LxDialogService.close('add-destination-dialog');

    };

    $scope.removeDestination = function(destination) {
        LxNotificationService.confirm(gettextCatalog.getString('Delete Destination'),
            gettextCatalog.getString('Are you sure you want to delete the destination') + ' "' +
            destination.city + '"', {
                cancel:gettextCatalog.getString('Cancel'),
                ok:gettextCatalog.getString('Confirm')
            }, function(answer) {
                if (answer) {
                    $scope.editedTrip.removeDestination(destination);
                    $scope.loadDestinationsInMap($scope.editedTrip);
                }
            });
    };

    $scope.placeChanged = function() {
        $scope.place = this.getPlace();
    };

    $scope.addLatLongToDestination = function(destination) {
        var location = $scope.place.geometry.location;
        destination.location.latitude = location.A;
        destination.location.longitude = location.F;
        return destination;
    };


    updateMapBounds = function (aTrip) {
        var bounds = new google.maps.LatLngBounds();
        _.each($scope.polyline.getPath().j, function(latLng){
            bounds.extend(latLng);
        });
        $scope.map.setCenter(bounds.getCenter());
        $scope.map.fitBounds(bounds);
    };

    $scope.loadDestinationsInMap = function(aTrip){
        if(!aTrip.destinations || aTrip.destinations.length === 0) { return; }

        if($scope.map){
            $scope.polyline.setPath(_.map(aTrip.destinations, function(destination){
                var location = destination.location;
                return new google.maps.LatLng(location.latitude, location.longitude);
            }));
            updateMapBounds(aTrip);
        }
    };

    $scope.$on('mapInitialized', function(event, map) {
        $scope.loadDestinationsInMap(trip);
        $scope.polyline.setMap($scope.map);
    });

}]);
