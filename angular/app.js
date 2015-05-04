var app = angular.module('vacacionesPermanentes',
    ['ui.router', 'ngMaterial', 'ui.gravatar', 'angularMoment','gettext', 'uiGmapgoogle-maps']);

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
app.config(['$interpolateProvider', '$stateProvider', '$urlRouterProvider', '$mdThemingProvider','uiGmapGoogleMapApiProvider', function (
        $interpolateProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, GoogleMapApi) {
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

    GoogleMapApi.configure({
        v:'3.17',
        libraries: 'places'
    });

    $urlRouterProvider.otherwise('home');

    $mdThemingProvider.theme('default')
        .primaryPalette('light-green')
        .accentPalette('red');
}]);

app.run(['amMoment', 'gettextCatalog', function(amMoment, gettextCatalog) {
    var defaultLang = 'es';

    gettextCatalog.loadRemote("/locales/" + defaultLang + ".json");

    amMoment.changeLocale(defaultLang);
    gettextCatalog.setCurrentLanguage(defaultLang);
}]);

global.app = module.exports = app;

require('./services');
require('./controllers');