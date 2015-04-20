app.factory('tripService', ['$http', 'authService', function ($http, authService) {
    var remote_uri = function(id) {
        if (id) { return '/trips/' + id; }
        else { return '/trips'; }
    };

    var tripService = {};
    tripService.all = [];
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
    tripService.delete = function (id) {
        return $http.delete(remote_uri(id)).then(function (res) {
            return res.data;
        });
    };
    return tripService;
}]);
