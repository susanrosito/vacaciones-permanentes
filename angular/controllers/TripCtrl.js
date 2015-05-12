app.controller('TripCtrl', ['$scope', '$state', 'LxNotificationService', 'LxDatePickerService',
    'gettextCatalog', 'authService', 'tripService', 'trip', function (
    $scope, $state, LxNotificationService, LxDatePickerService, gettextCatalog, authService, tripService, trip) {

    if (authService.isLoggedIn() && tripService.all.length ===0) {
        tripService.getAll();
    }

    $scope.trips = tripService.all;
    $scope.trip = trip;


    $scope.editedTrip = new tripService.Trip();
    $scope.editedTrip.resetTo($scope.trip);
    $scope.editedTrip.isEditing = false;
    $scope.tempDestination = new tripService.Destination();
    $scope.isAddDestinationShowned = false;
    setTimeout(function() { LxDatePickerService.disableAll() }, 1000);
    // In display mode, will display the current trip

    $scope.enterEditMode = function() {
        LxDatePickerService.enableAll();
        $scope.editedTrip.isEditing = true;
    };

    $scope.cancelEdit = function() {
        $scope.editedTrip.resetTo($scope.trip);
        $state.go('trip', {id: $scope.trip._id});
        LxDatePickerService.disableAll();
        $scope.editedTrip.isEditing = false;
        $scope.mapData.loadDestinations($scope.trip);
    };

    $scope.confirmEdit = function() {
        tripService.update($scope.editedTrip);
        $scope.trip.resetTo($scope.editedTrip);
        LxDatePickerService.disableAll();
        $scope.editedTrip.isEditing = false;
        $scope.mapData.loadDestinations($scope.trip);
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

    $scope.showAddDestinationBox = function () {
        $scope.isAddDestinationShowned = true;
        $scope.tempDestination.resetTo(new tripService.Destination());
    };

    $scope.closeAddDestinationBox = function() {
        $scope.isAddDestinationShowned = false;
    };

    $scope.addDestination = function(destination) {
        var dest = new tripService.Destination();
        dest.resetTo($scope.tempDestination);
        dest.latitude = $scope.tempDestination.latitude;
        dest.longitude = $scope.tempDestination.longitude;
        $scope.editedTrip.addDestination(dest);
        $scope.mapData.loadDestinations($scope.editedTrip);
        $scope.tempDestination.resetTo(new tripService.Destination());
        $scope.isAddDestinationShowned = false;
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
                    $scope.mapData.loadDestinations($scope.editedTrip);
                }
            });
    };

    $scope.placeChanged = function() {
        var place = this.getPlace();
        var location = place.geometry.location;
        $scope.tempDestination.latitude = location.A;
        $scope.tempDestination.longitude = location.F
    };



    $scope.mapData = {};
    $scope.mapData.polyline = new google.maps.Polyline({
        strokeColor: '#6060FB',
        strokeOpacity: 1.0,
        geodesic: true,
        strokeWeight: 3
    });
    $scope.mapData.loadDestinations = function(trip) {
        if(trip.destinations && trip.destinations.length > 0 && $scope.map) {
            this.polyline.setPath(_.map(trip.destinations, function(destination) {
                return new google.maps.LatLng(destination.latitude, destination.longitude);
            }));
            // Update map bound
            var bounds = new google.maps.LatLngBounds();
            _.each(this.polyline.getPath().j, function(latLng){
                bounds.extend(latLng);
            });
            $scope.map.setCenter(bounds.getCenter());
            $scope.map.fitBounds(bounds);
        }
    };

    $scope.$on('mapInitialized', function(event, map) {
        $scope.mapData.loadDestinations(trip);
        $scope.mapData.polyline.setMap($scope.map);
    });

}]);
