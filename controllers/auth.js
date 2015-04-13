var app = require("./app.js");

app.factory('auth', function($http, $window){
    var auth = {};

    auth.saveToken = function (token){
        $window.localStorage['flapper-news-token'] = token;
    };

    auth.getHeader = function() {
        return {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        };
    };

    auth.getToken = function (){
        return $window.localStorage['flapper-news-token'];
    };

    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function(){
        $window.localStorage.removeItem('flapper-news-token');
    };

    return auth;
});

app.controller('AuthCtrl', function($scope, $state, auth){
    $scope.user = {};

    $scope.register = function(){
        auth.register($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            $state.go('home');
        });
    };

    $scope.logIn = function(){
        auth.logIn($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            $state.go('home');
        });
    };
});

app.controller('NavCtrl', function($scope, $mdSidenav, auth){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = function() {
        auth.logOut();
        $scope.toggleRight();
    };

    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function() {
        $mdSidenav('right').toggle();
    };
});