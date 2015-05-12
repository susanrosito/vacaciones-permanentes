app.factory('authService', ['$http', '$window', function($http, $window) {
    var tokenName = 'vacaciones-permanentes-token';

    var authService = {};
    authService.saveToken = function (token) {
        $window.localStorage[tokenName] = token;
    };
    authService.getToken = function () {
        return $window.localStorage[tokenName];
    };
    authService.getHeader = function() {
        return {
            headers: {Authorization: 'Bearer ' + authService.getToken()},
            timeout: 5000
        };
    };
    authService.getPayload = function() {
        var token = authService.getToken();
        if(token) {
            return JSON.parse($window.atob(token.split('.')[1]));
        } else {
            return null;
        }
    };
    authService.isLoggedIn = function() {
        var payload = authService.getPayload();
        if(payload) {
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    authService.currentUser = function() {
        if(authService.isLoggedIn()) {
            var payload = authService.getPayload();
            return {
                _id: payload._id,
                email: payload.email,
                name: payload.name,
                lang: payload.lang
            };
        }
        return null;
    };
    authService.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            authService.saveToken(data.token);
        });
    };
    authService.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            authService.saveToken(data.token);
        });
    };
    authService.logOut = function() {
        $window.localStorage.removeItem(tokenName);
    };
    return authService;
}]);
