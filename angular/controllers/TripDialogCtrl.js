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
        if(!$scope.places || $scope.places.length == 0){return;}

        if($scope.places.length == 1){
            trip.cities = trip.cities || [];
            place = $scope.places[0];
            city = {city: place.name, loc: {long: place.geometry.location.B, lat: place.geometry.location.k}, img: {} };
            trip.cities.push(city);
            addPoly(city);
            updateMapBounds();
            $scope.places = null;
        }
    };

    addPoly = function (city) {
        path = {latitude: city.loc.lat, longitude: city.loc.long};
        $scope.map.polys[0].path.push(path);
    };

    updateMapBounds = function (bounds) {
        var bounds = new google.maps.LatLngBounds();
        _.each(trip.cities, function(city){
            bounds.extend(new google.maps.LatLng(city.loc.lat, city.loc.long));
        });
        $scope.map.bounds = {
            northeast: {
                latitude: bounds.getNorthEast().lat(),
                longitude: bounds.getNorthEast().lng()
            },
            southwest: {
                latitude: bounds.getSouthWest().lat(),
                longitude: bounds.getSouthWest().lng()
            }
        }
    };


    GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
        $scope.map.polys =  [
            {id:1, editable: true, draggable: false, "geodesic": true, "visible": true,
                path: [],
                stroke: {"color": "#6060FB","weight": 3}}
        ];

        updateMapBounds(new google.maps.LatLngBounds());
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds();
    });

    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, control: {}, polys:[]};
    $scope.options = {scrollwheel: false};
    $scope.searchbox = { template:'searchbox.tpl.html', position:'top-left', options: { bounds: {} }, events: {
        places_changed: function (searchBox) {
            $scope.places = searchBox.getPlaces();
        }
    }};

    $scope.disableAddCityButton = function(){
        return $scope.places == null || $scope.places.length <= 0;
    }
}]);
