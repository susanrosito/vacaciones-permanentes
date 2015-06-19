app.controller('DestinationCtrl', ['$scope', '$state', '$focus', 'LxNotificationService',
    'gettextCatalog', 'authService', 'tripService', 'trip', 'destination', function(
    $scope, $state, $focus, LxNotificationService, gettextCatalog, authService, tripService, trip, destination) {

    if (authService.isLoggedIn() && tripService.all.length === 0) {
        tripService.getAll();
    }

    $scope.trips = tripService.all;
    $scope.trip = trip;
    $scope.destination = destination;
    $scope.hotelsInCity = [];

    $scope.editedDestination = new tripService.Destination($scope.destination);
    $scope.editedDestination.isEditing = false;
    $scope.tempPOI = new tripService.POI();
    $scope.isAddPOIshowned = false;

    $scope.enterEditMode = function() {
        $scope.editedDestination.isEditing = true;
        setTimeout(function() { angular.element('#hotel-autocomplete_value').focus(); }, 50);
    };

    $scope.cancelEdit = function() {
        $scope.editedDestination.resetTo($scope.destination);
        $scope.editedDestination.isEditing = false;
        // $state.go('destination', {id: $scope.trip._id, destinationId: $scope.destination._id});
        $scope.mapData.loadPOI($scope.trip);
        angular.element('#hotel-autocomplete_value').val($scope.editedDestination.hotel.name);
    };

    $scope.confirmEdit = function() {
        angular.element();
        tripService.updateDestination($scope.trip, $scope.editedDestination).success(function() {
            $state.go('destination',
                    { id: $scope.trip._id, destinationId: $scope.destination._id },
                    { reload: true });
        });
        $scope.cancelEdit();
    };

    $scope.updateHotel = function(data) {
        if (data.originalObject) {
            $scope.editedDestination.hotel = data.originalObject;
        }
    };

    $scope.showAddPOIBox = function() {
        $scope.isAddPOIshowned = true;
        $scope.tempPOI.resetTo(new tripService.POI());
        $focus('add-dialog-show');
    };

    $scope.closeAddPOIBox = function() {
        $scope.isAddPOIshowned = false;
    };

    $scope.addPOI = function() {
        $scope.editedDestination.addPOI($scope.tempPOI.clone());
        $scope.tempPOI.resetTo(new tripService.POI());
        $scope.isAddPOIshowned = false;
        $scope.mapData.loadPOI($scope.editedDestination);
    };

    $scope.removePOI = function(poi) {
        $scope.editedDestination.removePOI(poi);
        $scope.mapData.loadPOI($scope.editedDestination);
    };

    $scope.placeChanged = function() {
        var place = this.getPlace();
        $scope.tempPOI.name = place.name;
        $scope.tempPOI.icon = place.icon;
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        $scope.tempPOI.address = place.formatted_address;
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        $scope.tempPOI.ranking = Math.round(place.rating * 2) || 0;
        $scope.tempPOI.latitude = place.geometry.location.A;
        $scope.tempPOI.longitude = place.geometry.location.F;
    };

    $scope.mapData = {};

    $scope.selectedMarker = '';

    $scope.mapData.loadPOI = function(destination) {
        if (destination.pois && destination.pois.length > 0 && $scope.map) {
            var bounds = new google.maps.LatLngBounds();
            _.each(destination.pois, function(poi) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(poi.latitude, poi.longitude)
                });
                marker.setMap($scope.map);
                bounds.extend(marker.position);
            });
            if (destination.hotel.name) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(destination.hotel.latitude, destination.hotel.longitude),
                    icon: 'images/hotel.png'
                });
                marker.setMap($scope.map);
                bounds.extend(marker.position);
            }
            $scope.map.setCenter(bounds.getCenter());
            $scope.map.fitBounds(bounds);
        }
    };

    $scope.search = function() {
        $scope.places = new google.maps.places.PlacesService($scope.map);

        $scope.showDetailLodging = function() {
            $scope.selectedMarker = this;
        };

        $scope.places.nearbySearch({ bounds: $scope.map.getBounds(), types: ['lodging'] }, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $scope.hotelsInCity = [];
                for (var i = 0; i < results.length; i++) {
                    $scope.hotelsInCity.push({
                        name: results[i].name,
                        icon: results[i].icon,
                        address: results[i].vicinity,
                        ranking: Math.round(results[i].rating * 2) || 0,
                        latitude: results[i].geometry.location.A,
                        longitude: results[i].geometry.location.F
                    });
                }
            }
        });
    };

    $scope.$on('mapInitialized', function() {
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(
                $scope.destination.latitude,
                $scope.destination.longitude
        ));
        $scope.map.setCenter(bounds.getCenter());
        $scope.map.fitBounds(bounds);
        $scope.map.setZoom(14);
        $scope.mapData.loadPOI(destination);
        $scope.search();
    });

    setTimeout(function() {
        if ($scope.editedDestination.hotel.name) {
            angular.element('#hotel-autocomplete_value').val($scope.editedDestination.hotel.name)
                .closest('.text-field').addClass('text-field--is-active');
        }
    }, 1000);
} ]);
