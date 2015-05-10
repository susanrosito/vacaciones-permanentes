app.controller('TripCtrl', ['$scope', '$state', 'LxNotificationService', 'gettextCatalog', 'authService', 'tripService', 'trip', function (
    $scope, $state, LxNotificationService, gettextCatalog, authService, tripService, trip) {

    if (authService.isLoggedIn() && tripService.all.length ===0) {
        tripService.getAll();
    }

    $scope.trips = tripService.all;
    $scope.trip = trip;
    $scope.editedTrip = new tripService.Trip();
    $scope.editedTrip.resetTo($scope.trip);
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, polys:[]};

    /*
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


    $scope.showDeleteDialog = function (ev) {
        $mdDialog.show($mdDialog.confirm()
            .title('Would you like to delete this trip?')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev)
        ).then(function (answer) {
                tripService.remove($scope.trip);
                $mdDialog.hide();
                $state.go('home');
        }, function () {
                $mdDialog.hide();
        });
    };

    $scope.showEditDialog = function (ev) {
        $mdDialog.show({
            controller: 'TripDialogCtrl',
            templateUrl: '/partials/trip.html',
            targetEvent: ev,
            locals: { trip: $scope.trip }
        }).then(function (answer) {
            $state.go('home');
        }, function () {
            $mdDialog.hide();
        });
    };

    */

    /*
     <script type="text/ng-template" id="searchbox.tpl.html">
     <input ng-model="searchPlace" placeholder="Search Box">
     </script>

     <md-card class="post-card" ng-repeat="city in trip.cities" id="[[post._id]]">
     <h4>[[city.city]]</h4>
     </md-card>
     <md-button ng-click="addCity()" class="md-primary" ng-disabled="disableAddCityButton()">
     Add City
     </md-button>

     <ui-gmap-google-map center="map.center" zoom="map.zoom" dragging="map.dragging" bounds="map.bounds" events="map.events" options="map.options" pan="true" control="map.control">
     <ui-gmap-search-box options="searchbox.options" template="searchbox.template" events="searchbox.events" position="searchbox.position"></ui-gmap-search-box>
     <ui-gmap-polylines models="map.polys" path="'path'" stroke="'stroke'" draggable="'draggable'" editable="'editable'" geodesic="'geodesic'" visible="'visible'" static='false'></ui-gmap-polylines>
     </ui-gmap-google-map>
     */

    $scope.cancelEdit = function() {
        $scope.editedTrip.resetTo($scope.trip);
        $state.go('trip', {id: $scope.trip._id})
    };

    $scope.confirmEdit = function() {
        tripService.update($scope.editedTrip);
        $scope.trip.resetTo($scope.editedTrip);
        $state.go('trip', {id: $scope.trip._id})
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

    addPoly = function (destination) {
        var location = destination.location;
        var path = [location.latitude, location.longitude];
        $scope.map.polys.push(path);
    };

    updateMapBounds = function (bounds) {
        var bounds = new google.maps.LatLngBounds();
        _.each(trip.destinations, function(destination){
            var location = destination.location;
            bounds.extend(new google.maps.LatLng(location.latitude, location.longitude));
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

    $scope.loadDestinationsInMap = function(){
        console.log('esta pasando por loadDestination');
        if(!trip.destinations || trip.destinations.length === 0) { return; }

        _.each(trip.destinations, function(destination){
            addPoly(destination);
        });

        updateMapBounds();
    };

    $scope.loadDestinationsInMap();

}]);
