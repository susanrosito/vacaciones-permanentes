app.controller('TripDialogCtrl', ['$scope', '$mdDialog', 'authService', 'tripService', 'trip', 'uiGmapGoogleMapApi', function(
        $scope, $mdDialog, authService, tripService, trip, GoogleMapApi) {

    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.trip = trip;
    $scope.isNew = trip._id == undefined;

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.accept = function () {
        if ((!trip.title || trip.title === '') &&
            (!trip.startDate || trip.startDate === '') &&
            (!trip.endDate || trip.endDate === '') &&
            (!trip.startDate <= trip.endDate) &&
            (!trip.cities || trip.cities.length === 0)) {
            return;
        }
        if($scope.isNew){
            tripService.create(trip);
        }else{
            tripService.edit(trip);
        }
        $mdDialog.hide();

        //$scope.title = '';
        //$scope.startDate = '';
        //$scope.endDate = '';
    };

    $scope.addCity = function () {
        console.log("Pasa por addCity del controller");
        if(!$scope.places || $scope.places.length == 0){return;}

        if($scope.places.length == 1){
            place = $scope.places[0];
            city = {city: place.name, loc: {long: place.geometry.location.B, lat: place.geometry.location.k}, img: {} };
            trip.cities.push(city);
        }
    };

    GoogleMapApi.then(function(maps) {
        console.log("Pasa por aqui cuando esta el dialog activo")
        maps.visualRefresh = true;
        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.82148, -73.66450),
            new google.maps.LatLng(40.66541, -74.31715));

        $scope.map.bounds = {
            northeast: {
                latitude:$scope.defaultBounds.getNorthEast().lat(),
                longitude:$scope.defaultBounds.getNorthEast().lng()
            },
            southwest: {
                latitude:$scope.defaultBounds.getSouthWest().lat(),
                longitude:-$scope.defaultBounds.getSouthWest().lng()

            }
        };
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());

    });

    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, control: {}};
    $scope.options = {scrollwheel: false};
    $scope.searchbox = { template:'searchbox.tpl.html', position:'top-left', options: { bounds: {} }, events: {
        places_changed: function (searchBox) {
            $scope.places = searchBox.getPlaces();
        }
    }};
}]);
