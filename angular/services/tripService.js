app.factory('tripService', ['$http', 'authService', function($http, authService) {
    var remoteUri = function(id) {
        if (id) { return '/trips/' + id; }
        else { return '/trips'; }
    };

    var tripService = {};

    tripService.Trip = require('../types/Trip.js');
    tripService.POI = require('../types/POI.js');
    tripService.Destination = require('../types/Destination');

    tripService.all = [];

    tripService.getIndexById = function(id) {
        var arrayObjectIndexOf = function(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) { return i; }
            }
            return -1;
        };
        return arrayObjectIndexOf(tripService.all, id, '_id');
    };
    tripService.getAll = function() {
        return $http.get(remoteUri(), authService.getHeader()).success(function(allTrips) {
            angular.copy(_.each(allTrips, function(t) { new tripService.Trip(t); }), tripService.all);
        });
    };
    tripService.create = function(trip) {
        return $http.post(remoteUri(), trip, authService.getHeader()).success(function(remoteTrip) {
            tripService.all.push(new tripService.Trip(remoteTrip));
        });
    };
    tripService.get = function(id) {
        return $http.get(remoteUri(id), authService.getHeader()).success(function(remoteTrip) {
            return remoteTrip;
        });
    };
    tripService.getDestination = function(tripId, destinationId) {
        return $http.get(remoteUri(tripId) + '/destination/' + destinationId,
                authService.getHeader()).success(function(remoteDestination) {
            return remoteDestination;
        });
    };
    tripService.remove = function(trip) {
        return $http.delete(remoteUri(trip._id), authService.getHeader()).success(function(remoteTrip) {
            var index = tripService.getIndexById(remoteTrip._id);
            if (index != -1) {
                tripService.all.splice(index, 1);
            }
        });
    };
    tripService.update = function(trip) {
        return $http.put(remoteUri(trip._id), trip, authService.getHeader()).success(function(remoteTrip) {
            var index = tripService.getIndexById(remoteTrip._id);
            if (index != -1) {
                tripService.all.splice(index, 1, new tripService.Trip(remoteTrip));
            }
        });
    };

    tripService.updateDestination = function(trip, destination) {
        destination.newHotel = destination.hotel; // This is a fix for a timing request bug.
        return $http.put(remoteUri(trip._id) + '/destination/' + destination._id,
                destination, authService.getHeader()).success(function(remoteDestination) {
            trip.updateDestination(destination, remoteDestination);
        });
    };

    return tripService;
} ]);
