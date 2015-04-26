app.factory('tripService', ['$http', 'authService', function ($http, authService) {
    var remote_uri = function(id) {
        if (id) { return '/trips/' + id; }
        else { return '/trips'; }
    };

    var tripService = {};
    tripService.all = [];
    tripService.getIndexBYId = function(id) {
        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for(var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }
        return arrayObjectIndexOf(tripService.all, id, '_id');
    }
    tripService.getAll = function () {
        return $http.get(remote_uri()).success(function (data) {
            angular.copy(data, tripService.all);
        });
    };
    tripService.create = function (trip) {
        return $http.post(remote_uri(), trip, authService.getHeader()).success(function (data) {
            tripService.all.push(data);
        });
    };
    tripService.get = function (id) {
        return $http.get(remote_uri(id)).then(function (res) {
            return res.data;
        });
    };
    tripService.delete = function (trip) {
        return $http.delete(remote_uri(trip._id), authService.getHeader()).success(function (res) {
            var index = tripService.getIndexBYId(trip._id);
            if(index != -1) {
                tripService.all.splice(index, 1);
            }
        });
    };

    tripService.edit = function (trip) {
        return $http.put(remote_uri(trip._id), trip, authService.getHeader()).success(function (data){
            var index = tripService.getIndexBYId(trip._id);
            if(index != -1) {
                tripService.all.splice(index, 1, data);
            }
        });
    };

    return tripService;
}]);
