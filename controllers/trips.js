var app = require("./app.js");
var PLEASE_LOGIN = "Please, log in in order to ";

app.factory('trips', function ($http, auth) {
    var remote_uri = function(id) {
        if (id) {return "/trips/" + id}
        else {return "/trips";}
    }

    var trips = [];
    trips.getAll = function () {
        return $http.get(remote_uri()).success(function (data) {
            angular.copy(data, trips);
        });
    };
    trips.create = function (post) {
        return $http.post(remote_uri(), post, auth.getHeader()).success(function (data) {
            trips.push(data);
        });
    };
    trips.get = function (id) {
        return $http.get(remote_uri(post._id)).then(function (res) {
            return res.data;
        });
    };
    trips.delete = function (id) {
        return $http.delete(remote_uri(post._id)).then(function (res) {
            return res.data;
        });
    };
    return trips;
});

app.controller('TripsCtrl', function ($scope, $http, trips, $mdDialog, $mdToast, auth) {

    /** Return true if the message has been showned */
    function warnNotLoggedIn(action) {
        if (!auth.isLoggedIn()) {
            $mdToast.show($mdToast.simple()
                .content(PLEASE_LOGIN + action)
                .position("bottom left")
                .hideDelay(3000));
        }
        return !auth.isLoggedIn();
    }

    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.trips = trips;

    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.create = function () {
            if ((!$scope.title || $scope.title === '') &&
                (!$scope.startDate || $scope.startDate === '') &&
                (!$scope.endDate || $scope.endDate === '') &&
                (!$scope.startDate <= $scope.endDate)) {
                return;
            }
            trips.create({
                title: $scope.title,
                startDate: $scope.startDate,
                endDate: $scope.endDate
            });
            $scope.title = '';
            $scope.startDate = '';
            $scope.endDate = '';
            $mdDialog.hide();
        };
    }

    $scope.showAddDialog = function (ev) {
        if (warnNotLoggedIn("create a new trip")) {return;}
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/partials/addTrip.html',
            targetEvent: ev
        }).then(function (answer) {}, function () {
            $mdDialog.hide();
        });
    };
});