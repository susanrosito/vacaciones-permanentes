helpers = require('./helpers');

var app = angular.module('vacacionesPermanentes',
    ['ui.router', 'ui.gravatar', 'lumx', 'angularMoment','gettext', 'ngMap']);

app.config(['$interpolateProvider', '$stateProvider', '$urlRouterProvider', function (
        $interpolateProvider, $stateProvider, $urlRouterProvider) {
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
        .state('destination', {
            url: '/trip/:id/destination/:destinationId',
            templateUrl: '/destination.html',
            controller: 'DestinationCtrl',
            onEnter: helpers.goToLogin,
            resolve: {
                trips: helpers.getAllTrips,
                trip: helpers.getTrip,
                destination: helpers.getDestination
            }
        });

    $urlRouterProvider.otherwise('home');

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