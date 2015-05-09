helpers = require('./helpers');

var app = angular.module('vacacionesPermanentes',
    ['ui.router', 'ui.gravatar', 'lumx', 'angularMoment','gettext', 'uiGmapgoogle-maps']);

app.config(['$interpolateProvider', '$stateProvider', '$urlRouterProvider','uiGmapGoogleMapApiProvider', function (
        $interpolateProvider, $stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'TripListCtrl',
            onEnter: helpers.goToLoginTimedOut
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'AuthCtrl',
            onEnter: helpers.goToHome
        })
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthCtrl',
            onEnter: helpers.goToHome
        })
        .state('trip', {
            url: '/trip/:id',
            templateUrl: '/trip.html',
            controller: 'TripCtrl',
            onEnter: helpers.goToLogin,
            resolve: {
                trips: helpers.getAllTrips,
                trip: helpers.getTrip
            }
        })
        .state('trip-edit', {
            url: '/trip/:id/edit',
            templateUrl: '/trip-edit.html',
            controller: 'TripCtrl',
            onEnter: helpers.goToLogin,
            resolve: {
                trips: helpers.getAllTrips,
                trip: helpers.getTrip
            }
        });

    $urlRouterProvider.otherwise('home');

    uiGmapGoogleMapApiProvider.configure({v:'3.17', libraries: 'places, geometry'});
}]);

app.run(['amMoment', 'gettextCatalog', function(amMoment, gettextCatalog) {
    var defaultLang = 'es';

    gettextCatalog.loadRemote("/locales/" + defaultLang + ".json");

    amMoment.changeLocale(defaultLang);
    gettextCatalog.setCurrentLanguage(defaultLang);
}]);

global.app = module.exports = app;

require('./directives');
require('./services');
require('./controllers');