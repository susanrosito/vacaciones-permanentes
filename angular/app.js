var app = angular.module('vacacionesPermanentes',
    ['ui.router', 'ngMaterial', 'ui.gravatar', 'angularMoment']);

function onLoggedIn() {
    return ['$state', 'authService', function($state, authService) {
        if(authService.isLoggedIn()){
            $state.go('home');
        }
    }];
}
function onNotLoggedIn() {
    return ['$state', 'authService', function($state, authService) {
        if(!authService.isLoggedIn()){
            // There is a bug here, so this breaks when called multiple times
            // No fix available. v 1.0 of ui.-router will solve this.
            $state.transitionTo('login');
        }
    }];
}
app.config(['$interpolateProvider', '$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function (
        $interpolateProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'TripCtrl',
            onEnter: onNotLoggedIn,
            resolve: {
                tripPromise: ['tripService', function (tripService) {
                    return tripService.getAll();
                }]
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'AuthCtrl',
            onEnter: onLoggedIn
        })
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthCtrl',
            onEnter: onLoggedIn
        })
        .state('trip', {
            url: '/trip/:id',
            templateUrl: '/trip.html',
            controller: 'SingleTripCtrl',
            resolve: {
                tripPromise: ['tripService', function (tripService) {
                    return tripService.getAll();
                }],
                trip: ['$stateParams', 'tripService', function($stateParams, tripService) {
                    return tripService.get($stateParams.id);
                }]
            }
        });
    $urlRouterProvider.otherwise('home');


    $mdThemingProvider.theme('default')
        .primaryPalette('light-green')
        .accentPalette('red');
}]);

app.run(['amMoment', function(amMoment) {
    amMoment.changeLocale('es');
}]);

global.app = module.exports = app;

require('./services');
require('./controllers');