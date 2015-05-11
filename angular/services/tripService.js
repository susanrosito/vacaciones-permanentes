app.factory('tripService', ['$http', 'authService', function ($http, authService) {
    var remote_uri = function(id) {
        if (id) { return '/trips/' + id; }
        else { return '/trips'; }
    };

    var tripService = {};
    tripService.all = [];
    tripService.getIndexById = function(id) {
        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for(var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }
        return arrayObjectIndexOf(tripService.all, id, '_id');
    };
    tripService.getAll = function () {
        return $http.get(remote_uri(), authService.getHeader()).success(function (allTrips) {
            angular.copy(allTrips, tripService.all);
        });
    };
    tripService.create = function (trip) {
        return $http.post(remote_uri(), trip, authService.getHeader()).success(function (remoteTrip) {
            tripService.all.push(remoteTrip);
        });
    };
    tripService.get = function (id) {
        return $http.get(remote_uri(id), authService.getHeader()).success(function(remoteTrip) {
            return remoteTrip;
        });
    };
    tripService.remove = function (trip) {
        return $http.delete(remote_uri(trip._id), authService.getHeader()).success(function (remoteTrip) {
            var index = tripService.getIndexById(remoteTrip._id);
            console.log(index);
            if(index != -1) {
                tripService.all.splice(index, 1);
            }
        });
    };
    tripService.update = function (trip) {
        return $http.put(remote_uri(trip._id), trip, authService.getHeader()).success(function (remoteTrip){
            var index = tripService.getIndexById(remoteTrip._id);
            if(index != -1) {
                tripService.all.splice(index, 1, remoteTrip);
            }
        });
    };

    tripService.Trip = function() {
        var today = new Date();
        var defaultEnd = new Date(today);
        // Set end as 15 days from now
        defaultEnd.setDate(today.getDate() + 15);
        this._id = null;
        this.title = '';
        this.startDate = today;
        this.endDate = defaultEnd;
        this.destinations = [];
        tripService.addMethods(this);
    };
    tripService.Destination = function() {
        var today = new Date();
        var defaultEnd = new Date(today);
        // Set end as 5 days from now
        defaultEnd.setDate(today.getDate() + 5);
        this.title = '';
        this.startDate = today;
        this.endDate = defaultEnd;
        this.location = {latitude:0, longitude:0};
        tripService.addValidationMethods(this);
    };
    tripService.addValidationMethods = function(dateable) {
        if (!dateable.hasValidDates) {
            dateable.hasValidDates = function () {
                return !this.startDate || !this.endDate ||
                        this.startDate < this.endDate;
            };
            dateable.readyToSave = function () {
                return (this.startDate && this.endDate && !(this.title === '') && this.hasValidDates()) == true;
                // Yes, I have to compare to true for the ng-disabled to work
            };
            dateable._resetTo = function (reseter) {
                this._id = reseter._id;
                this.title = reseter.title;
                this.startDate = new Date(reseter.startDate);
                this.endDate = new Date(reseter.endDate);
            };
            dateable.resetTo = dateable._resetTo
        }
        return dateable;
    };
    tripService.addMethods = function(trip) {
        if (!trip.hasValidDates) {
            tripService.addValidationMethods(trip);
            trip.resetTo = function (reseter) {
                this._resetTo(reseter);
                this.destinations = [];
                angular.copy(reseter.destinations, this.destinations);
            };
            trip.copy = function() {
                var newTrip = new tripService.Trip();
                newTrip.resetTo(this);
                return newTrip;
            };
            trip.addDestination = function(destination) {
                // Called city in the server
                destination.city = destination.title;
                this.destinations.push(destination);
            };
            trip.removeDestination = function(destination) {
                var index = this.destinations.indexOf(destination);
                if (index != -1) {
                    this.destinations.splice(index, 1);
                }
            }
        }
        return trip;
    };

    return tripService;
}]);
