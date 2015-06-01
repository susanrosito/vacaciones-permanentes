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
        $scope.selectedPOI = new tripService.POI();

        $scope.enterEditMode = function() {
            $scope.editedDestination.isEditing = true;
        };

        $scope.cancelEdit = function() {
            $scope.editedDestination.resetTo($scope.destination);
            $scope.editedDestination.isEditing = false;
            $state.go('destination', {id: $scope.trip._id, destinationId: $scope.destination._id});
            $scope.mapData.loadPOI($scope.trip);
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
            $scope.tempPOI.resetTo(new tripService.POI());
            $scope.isAddPOIshowned = false;
            $scope.mapData.loadPOI($scope.editedDestination);
        };

        $scope.removePOI = function(poi) {
            $scope.editedDestination.removePOI(poi);
            $scope.mapData.loadPOI($scope.editedDestination);
        };

        $scope.changeSelectedPOI = function(poi){
            $scope.selectedPOI = poi;
        };

        $scope.placeChanged = function() {
            var place = this.getPlace();
            var location = place.geometry.location;
            $scope.tempPOI.name = place.name;
            $scope.tempPOI.address = place.formatted_address;
            $scope.tempPOI.ranking = place.rating;
            $scope.tempPOI.latitude = location.A;
            $scope.tempPOI.longitude = location.F;
            $scope.tempPOI.description = "Information of POI: "+ '\n' + $scope.tempPOI.name + '\n' + $scope.tempPOI.address;
        };

        $scope.mapData = {};

        $scope.selectedMarker = '';

        $scope.mapData.loadPOI = function(destination) {
            if(destination.pois && destination.pois.length > 0 && $scope.map) {
                var bounds = new google.maps.LatLngBounds();
                _.each(destination.pois, function(poi) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(poi.latitude, poi.longitude)
                    });
                    marker.setMap($scope.map);
                    bounds.extend(marker.position);
                });
                $scope.map.setCenter(bounds.getCenter());
                $scope.map.fitBounds(bounds);
            }
        };

        $scope.search = function(){
            $scope.places = new google.maps.places.PlacesService($scope.map);
            var search = {
                bounds: $scope.map.getBounds(),
                types: ['lodging']
            };

        $scope.showDetailLodging = function() {
            $scope.selectedMarker = this;
        };

        $scope.places.nearbySearch(search, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
                        /*var markerIcon = markerLetter + '.png';*/
                        var marker = new google.maps.Marker({
                            position: results[i].geometry.location,
                            animation: google.maps.Animation.DROP,
                            placeResult: results[i]
                            /*icon: markerIcon*/
                        });
                        marker.setMap($scope.map);
                        google.maps.event.addListener(marker, 'click', $scope.showDetailLodging);
                    }
                }
            });
        };

        $scope.$on('mapInitialized', function(event, map) {
             $scope.mapData.loadPOI(destination);
            $scope.search();
        });
}]);
