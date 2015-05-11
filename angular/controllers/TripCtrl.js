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
    };

    $scope.confirmEdit = function() {
        tripService.update($scope.editedTrip);
        $scope.trip.resetTo($scope.editedTrip);
        LxDatePickerService.disableAll();
        $scope.editedTrip.isEditing = false;
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
        $scope.editedTrip.addDestination(dest);
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
                }
            });
    };

    $scope.mapModel = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, polys:[]};

    addPoly = function (destination) {
        var location = destination.location;
        var path = [location.latitude, location.longitude];
        $scope.mapModel.polys.push(path);
    };

    updateMapBounds = function (bounds) {
        var bounds = new google.maps.LatLngBounds();
        _.each(trip.destinations, function(destination){
            var location = destination.location;
            bounds.extend(new google.maps.LatLng(location.latitude, location.longitude));
        });
        $scope.map.setCenter(bounds.getCenter());
        $scope.map.fitBounds(bounds);
    };

    $scope.loadDestinationsInMap = function(){
        if(!trip.destinations || trip.destinations.length === 0) { return; }

        _.each(trip.destinations, function(destination){
            addPoly(destination);
        });
    };

    $scope.$on('mapInitialized', function(event, map) {
        updateMapBounds();
    });

    $scope.loadDestinationsInMap();

}]);
