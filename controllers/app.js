var app = angular.module('vacacionesPermanentes', ["ui.router", "ngMaterial", "ui.gravatar", "angularMoment", "materialDatePicker"]);

app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'TripsCtrl',
            resolve: {
                tripPromise: function (trips) {
                    return trips.getAll();
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('home');
                }
            }]
        })
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('home');
                }
            }]
        });
    $urlRouterProvider.otherwise('home');
});
app.run(function(amMoment) {
    amMoment.changeLocale('es');
});

module.exports = app;