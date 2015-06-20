(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var helpers = require('./helpers');

global.app = module.exports = angular.module('vacacionesPermanentes',
    ['ui.router', 'ui.gravatar', 'lumx', 'angularMoment', 'gettext', 'ngMap', 'angucomplete-alt']);

app.config(['$interpolateProvider', '$stateProvider', '$urlRouterProvider', function(
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

    gettextCatalog.loadRemote('/locales/' + defaultLang + '.json');

    amMoment.changeLocale(defaultLang);
    gettextCatalog.setCurrentLanguage(defaultLang);
}]);

require('./directives');
require('./services');
require('./controllers');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./controllers":7,"./directives":9,"./helpers":11,"./services":16}],2:[function(require,module,exports){
app.controller('AuthCtrl', ['$scope', '$state', '$focus', 'LxNotificationService',
    'gettextCatalog', 'authService', function(
    $scope, $state, $focus, LxNotificationService, gettextCatalog, authService) {

    $scope.user = { name: '', email: '', password: '', passwordRepeat: '' };
    $scope.user.hasValidEmail = function() {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return this.email === '' || re.test(this.email);
    };
    $scope.user.hasValidPassword = function() {
        return this.password === '' || this.password.length >= 4;
    };
    $scope.user.hasValidRepeatedPassword = function() {
        return this.passwordRepeat === '' || this.password === this.passwordRepeat;
    };
    $scope.user.readyToLogin = function() {
        return this.password && this.email && this.hasValidEmail() && this.hasValidPassword();
    };
    $scope.user.readyToRegister = function() {
        return this.passwordRepeat && this.readyToLogin() && this.hasValidRepeatedPassword();
    };

    $scope.register = function() {
        authService.register($scope.user).error(function(error) {
            LxNotificationService.error(gettextCatalog.getString(error.message));
            $focus('init-or-fail-form');
        }).then(function() {
            $state.go('home');
        });
    };

    $scope.logIn = function() {
        authService.logIn($scope.user).error(function(error) {
            LxNotificationService.error(gettextCatalog.getString(error.message));
            $focus('init-or-fail-form');
        }).then(function() {
            $state.go('home');
        });
    };

    $focus('init-or-fail-form');
} ]);

},{}],3:[function(require,module,exports){
app.controller('DestinationCtrl', ['$scope', '$state', '$focus', 'LxNotificationService',
    'gettextCatalog', 'authService', 'tripService', 'trip', 'destination', function(
    $scope, $state, $focus, LxNotificationService, gettextCatalog, authService, tripService, trip, destination) {

    if (authService.isLoggedIn() && tripService.all.length === 0) {
        tripService.getAll();
    }

    $scope.trips = tripService.all;
    $scope.trip = trip;
    $scope.destination = destination;
    $scope.hotelsInCity = [];

    $scope.editedDestination = new tripService.Destination($scope.destination);
    $scope.editedDestination.isEditing = false;
    $scope.tempPOI = new tripService.POI();
    $scope.isAddPOIshowned = false;

    $scope.enterEditMode = function() {
        $scope.editedDestination.isEditing = true;
        setTimeout(function() { angular.element('#hotel-autocomplete_value').focus(); }, 50);
    };

    $scope.cancelEdit = function() {
        $scope.editedDestination.resetTo($scope.destination);
        $scope.editedDestination.isEditing = false;
        // $state.go('destination', {id: $scope.trip._id, destinationId: $scope.destination._id});
        $scope.mapData.loadPOI($scope.trip);
        angular.element('#hotel-autocomplete_value').val($scope.editedDestination.hotel.name);
    };

    $scope.confirmEdit = function() {
        angular.element();
        tripService.updateDestination($scope.trip, $scope.editedDestination).success(function() {
            $state.go('destination',
                    { id: $scope.trip._id, destinationId: $scope.destination._id },
                    { reload: true });
        });
        $scope.cancelEdit();
    };

    $scope.updateHotel = function(data) {
        if (data.originalObject) {
            $scope.editedDestination.hotel = data.originalObject;
        }
    };

    $scope.showAddPOIBox = function() {
        $scope.isAddPOIshowned = true;
        $scope.tempPOI.resetTo(new tripService.POI());
        $focus('add-dialog-show');
    };

    $scope.closeAddPOIBox = function() {
        $scope.isAddPOIshowned = false;
    };

    $scope.addPOI = function() {
        $scope.editedDestination.addPOI($scope.tempPOI.clone());
        $scope.tempPOI.resetTo(new tripService.POI());
        $scope.isAddPOIshowned = false;
        $scope.mapData.loadPOI($scope.editedDestination);
    };

    $scope.removePOI = function(poi) {
        $scope.editedDestination.removePOI(poi);
        $scope.mapData.loadPOI($scope.editedDestination);
    };

    $scope.placeChanged = function() {
        var place = this.getPlace();
        $scope.tempPOI.name = place.name;
        $scope.tempPOI.icon = place.icon;
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        $scope.tempPOI.address = place.formatted_address;
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        $scope.tempPOI.ranking = Math.round(place.rating * 2) || 0;
        $scope.tempPOI.latitude = place.geometry.location.A;
        $scope.tempPOI.longitude = place.geometry.location.F;
    };

    $scope.mapData = {};

    $scope.selectedMarker = '';

    $scope.mapData.loadPOI = function(destination) {
        if (destination.pois && destination.pois.length > 0 && $scope.map) {
            var bounds = new google.maps.LatLngBounds();
            _.each(destination.pois, function(poi) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(poi.latitude, poi.longitude)
                });
                marker.setMap($scope.map);
                bounds.extend(marker.position);
            });
            if (destination.hotel.name) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(destination.hotel.latitude, destination.hotel.longitude),
                    icon: 'images/hotel.png'
                });
                marker.setMap($scope.map);
                bounds.extend(marker.position);
            }
            $scope.map.setCenter(bounds.getCenter());
            $scope.map.fitBounds(bounds);
        }
    };

    $scope.search = function() {
        $scope.places = new google.maps.places.PlacesService($scope.map);

        $scope.showDetailLodging = function() {
            $scope.selectedMarker = this;
        };

        $scope.places.nearbySearch({ bounds: $scope.map.getBounds(), types: ['lodging'] }, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $scope.hotelsInCity = [];
                for (var i = 0; i < results.length; i++) {
                    $scope.hotelsInCity.push({
                        name: results[i].name,
                        icon: results[i].icon,
                        address: results[i].vicinity,
                        ranking: Math.round(results[i].rating * 2) || 0,
                        latitude: results[i].geometry.location.A,
                        longitude: results[i].geometry.location.F
                    });
                }
            }
        });
    };

    $scope.$on('mapInitialized', function() {
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(
                $scope.destination.latitude,
                $scope.destination.longitude
        ));
        $scope.map.setCenter(bounds.getCenter());
        $scope.map.fitBounds(bounds);
        $scope.map.setZoom(14);
        $scope.mapData.loadPOI(destination);
        $scope.search();
    });

    setTimeout(function() {
        if ($scope.editedDestination.hotel.name) {
            angular.element('#hotel-autocomplete_value').val($scope.editedDestination.hotel.name)
                .closest('.text-field').addClass('text-field--is-active');
        }
    }, 1000);
} ]);

},{}],4:[function(require,module,exports){
app.controller('NavigationCtrl', ['$state', '$scope', '$window', 'authService', function(
        $state, $scope, $window, authService) {

    var SIDEBAR_VISIBLE_DEFAULT_SIZE = 1024;

    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.currentUser = authService.currentUser;

    $scope.logOut = function() {
        authService.logOut();
        $state.go('login');
    };

    var updateSidebar = function() {
        $scope.isVisibleByWidth = $window.innerWidth > SIDEBAR_VISIBLE_DEFAULT_SIZE;
        $scope.isSidebarToggled = $scope.isVisibleByWidth;
    };
    updateSidebar();

    $scope.isSidebarVisible = function() {
        return ($scope._isSidebarToggled || $scope.isVisibleByWidth()) && $scope.isLoggedIn;
    };

    $scope.toggleSidebar = function() {
        if (!$scope.isVisibleByWidth) {
            $scope.isSidebarToggled = !$scope.isSidebarToggled;
        }
    };

    angular.element($window).bind('resize', function() { $scope.$apply(updateSidebar); });
    $scope.$on('$destroy', function() { angular.element($window).off('resize'); });
}]);

},{}],5:[function(require,module,exports){
app.controller('TripCtrl', ['$scope', '$state', '$focus', '$googleImageSearch', 'LxNotificationService',
    'LxDatePickerService', 'gettextCatalog', 'authService', 'tripService', 'trip', function(
    $scope,
    $state,
    $focus,
    $googleImageSearch,
    LxNotificationService,
    LxDatePickerService,
    gettextCatalog,
    authService,
    tripService,
    trip) {

    if (authService.isLoggedIn() && tripService.all.length === 0) {
        tripService.getAll();
    }

    $scope.trips = tripService.all;
    $scope.trip = trip;


    $scope.editedTrip = new tripService.Trip($scope.trip);
    $scope.editedTrip.isEditing = false;
    $scope.tempDestination = new tripService.Destination();
    $scope.isAddDestinationShowned = false;
    setTimeout(function() { LxDatePickerService.disableAll(); }, 1000);
    // In display mode, will display the current trip

    $scope.enterEditMode = function() {
        LxDatePickerService.enableAll();
        $scope.editedTrip.isEditing = true;
        $focus('enter-edit-mode');
    };

    $scope.cancelEdit = function() {
        $scope.editedTrip.resetTo($scope.trip);
        $scope.editedTrip.isEditing = false;
        LxDatePickerService.disableAll();
        $scope.mapData.loadDestinations($scope.trip);
        $state.go('trip', { id: $scope.trip._id });
    };

    $scope.confirmEdit = function() {
        $scope.editedTrip.isEditing = false;
        LxDatePickerService.disableAll();
        $scope.mapData.loadDestinations($scope.trip);
        tripService.update($scope.editedTrip).success(function() {
            $state.go('trip', { id: $scope.trip._id }, { reload: true });
        });
    };

    $scope.confirmDelete = function() {
        LxNotificationService.confirm(gettextCatalog.getString('Delete Trip'),
            gettextCatalog.getString('Are you sure you want to delete the trip') + ' "' +
            trip.title + '"', {
                cancel: gettextCatalog.getString('Cancel'),
                ok: gettextCatalog.getString('Confirm')
            }, function(answer) {
                if (answer) {
                    tripService.remove($scope.trip);
                    $state.go('home');
                }
            });
    };

    $scope.showAddDestinationBox = function() {
        $scope.isAddDestinationShowned = true;
        $scope.tempDestination.resetTo(new tripService.Destination());
        $focus('add-dialog-show');
    };

    $scope.closeAddDestinationBox = function() {
        $scope.isAddDestinationShowned = false;
    };

    $scope.addDestination = function() {
        var newDest = $scope.tempDestination.clone();
        $googleImageSearch.getImage(newDest.city, function(img) {
            newDest.image = img.url;
        });
        $scope.editedTrip.addDestination(newDest);
        $scope.tempDestination.resetTo(new tripService.Destination());
        $scope.isAddDestinationShowned = false;
        $scope.mapData.loadDestinations($scope.editedTrip);
    };

    $scope.removeDestination = function(destination) {
        LxNotificationService.confirm(gettextCatalog.getString('Delete Destination'),
            gettextCatalog.getString('Are you sure you want to delete the destination') + ' "' +
            destination.city + '"', {
                cancel: gettextCatalog.getString('Cancel'),
                ok: gettextCatalog.getString('Confirm')
            }, function(answer) {
                if (answer) {
                    $scope.editedTrip.removeDestination(destination);
                    $scope.mapData.loadDestinations($scope.editedTrip);
                }
            });
    };

    $scope.placeChanged = function() {
        var place = this.getPlace();
        var location = place.geometry.location;
        $scope.tempDestination.latitude = location.A;
        $scope.tempDestination.longitude = location.F;
    };

    $scope.mapData = {};
    $scope.mapData.polyline = new google.maps.Polyline({
        strokeColor: '#6060FB',
        strokeOpacity: 1.0,
        geodesic: true,
        strokeWeight: 3
    });
    $scope.mapData.loadDestinations = function(trip) {
        if (trip.destinations && trip.destinations.length > 0 && $scope.map) {
            this.polyline.setPath(_.map(trip.destinations, function(destination) {
                return new google.maps.LatLng(destination.latitude, destination.longitude);
            }));
            // Update map bound
            var bounds = new google.maps.LatLngBounds();
            _.each(this.polyline.getPath().j, function(latLng) {
                bounds.extend(latLng);
            });
            $scope.map.setCenter(bounds.getCenter());
            $scope.map.fitBounds(bounds);
            if (trip.destinations.length == 1) {
                $scope.map.setZoom(14);
            }
        }
    };

    $scope.$on('mapInitialized', function() {
        $scope.mapData.loadDestinations(trip);
        $scope.mapData.polyline.setMap($scope.map);
    });

} ]);

},{}],6:[function(require,module,exports){
app.controller('TripListCtrl', ['$scope', '$state', 'LxDialogService', 'LxNotificationService', 'LxDatePickerService',
    'gettextCatalog', 'tripService', 'authService', function(
    $scope,
    $state,
    LxDialogService,
    LxNotificationService,
    LxDatePickerService,
    gettextCatalog,
    tripService,
    authService) {

    if (authService.isLoggedIn() && tripService.all.length === 0) {
        tripService.getAll();
    }
    $scope.trips = tripService.all;
    $scope.newTrip = new tripService.Trip();
    $scope.newTrip.create = function() {
        tripService.create(this).success(function(trip) {
            LxDialogService.close('add-trip-dialog');
            $state.go('trip', { id: trip._id });
        }).error(function(error) {
            LxNotificationService.error(gettextCatalog.getString(error.message));
        });
    };

    $scope.showAddDialog = function() {
        LxDialogService.open('add-trip-dialog');
        $scope.newTrip.resetTo(new tripService.Trip());
        LxDatePickerService.handleClicks('add-trip-dialog');
    };

    $scope.closeAddDialog = function() {
        LxDatePickerService.endHandleClicks('add-trip-dialog');
    };
} ]);

},{}],7:[function(require,module,exports){
require('./TripCtrl.js');
require('./NavigationCtrl.js');
require('./AuthCtrl.js');
require('./TripListCtrl.js');
require('./DestinationCtrl.js');

},{"./AuthCtrl.js":2,"./DestinationCtrl.js":3,"./NavigationCtrl.js":4,"./TripCtrl.js":5,"./TripListCtrl.js":6}],8:[function(require,module,exports){
app.directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on('focusOn', function(e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});

app.factory('$focus', function($rootScope, $timeout) {
    return function(name) {
        $timeout(function() {
            $rootScope.$broadcast('focusOn', name);
        });
    };
});

},{}],9:[function(require,module,exports){
require('./focusOn.js');
require('./rating.js');

},{"./focusOn.js":8,"./rating.js":10}],10:[function(require,module,exports){
app.directive('starRating', function() {
    return {
        restrict: 'EA',
        template: '<ul class="rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // &#9733
        '  </li>' +
        '</ul>',
        scope: {
            ratingValue: '=ngModel',
            max: '=?', // Optional: default is 5
            onRatingSelected: '&?',
            readonly: '=?'
        },
        link: function(scope) {
            if (scope.max === undefined) { scope.max = 5; }
            var updateStars = function() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            scope.toggle = function(index) {
                if (scope.readonly === undefined || scope.readonly === false) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating: index + 1
                    });
                }
            };
            scope.$watch('ratingValue', function(oldVal, newVal) {
                if (newVal || newVal === 0) { updateStars(); }
            });
        }
    };
});

},{}],11:[function(require,module,exports){
module.exports = require('./resolvers.js');

},{"./resolvers.js":12}],12:[function(require,module,exports){
var exports = module.exports = {};

exports.getTrip = ['$stateParams', 'LxNotificationService', 'gettextCatalog', 'tripService',
    function($stateParams, LxNotificationService, gettextCatalog, tripService) {
    var result = tripService.get($stateParams.id);
    result.error(function(err) {
        LxNotificationService.error(gettextCatalog.getString(err.message));
    });
    return result.then(function(res) {
        return new tripService.Trip(res.data);
    });
} ];

exports.getDestination = ['$stateParams', 'LxNotificationService', 'gettextCatalog', 'tripService',
    function($stateParams, LxNotificationService, gettextCatalog, tripService) {
        var result = tripService.getDestination($stateParams.id, $stateParams.destinationId);
        result.error(function(err) {
            LxNotificationService.error(gettextCatalog.getString(err.message));
        });
        return result.then(function(res) {
            return new tripService.Destination(res.data);
        });
    } ];

exports.getAllTrips = ['tripService', function(tripService) {
    return tripService.getAll();
} ];

exports.goToLoginTimedOut = ['$timeout', '$state', 'authService', function($timeout, $state, authService) {
    $timeout(function() {
        if (!authService.isLoggedIn()) { $state.go('login'); }
    });
} ];

exports.goToLogin = ['$state', 'authService', function($state, authService) {
    if (!authService.isLoggedIn()) { $state.go('login'); }
} ];

exports.goToHome = ['$state', 'authService', function($state, authService) {
    if (authService.isLoggedIn()) { $state.go('home'); }
} ];

},{}],13:[function(require,module,exports){
app.factory('LxDatePickerService', [function() {

    var dtPickerService = {};
    var avoidOpeningTwoDatePickers = function(ev) {
        if (angular.element('.lx-date-picker--is-shown').length !== 0) {
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }
    };

    var disableClicks = function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    };

    dtPickerService.handleClicks = function(id) {
        angular.element('#' + id)[0].addEventListener('click', avoidOpeningTwoDatePickers, true);
    };

    dtPickerService.endHandleClicks = function(id) {
        angular.element('#' + id)[0].removeEventListener('click', avoidOpeningTwoDatePickers, true);
    };

    dtPickerService.disableAll = function() {
        var dtPicker = angular.element('.lx-date');
        dtPicker.prop('disabled');
        dtPicker.each(function(index, picker) {
            picker.addEventListener('click', disableClicks, true);
        });

    };
    dtPickerService.enableAll = function() {
        var dtPicker = angular.element('.lx-date');
        dtPicker.removeProp('disabled');
        dtPicker.each(function(index, picker) {
            picker.removeEventListener('click', disableClicks, true);
        });
    };

    return dtPickerService;
} ]);

},{}],14:[function(require,module,exports){
app.factory('authService', ['$http', '$window', function($http, $window) {
    var tokenName = 'vacaciones-permanentes-token';

    var authService = {};
    authService.saveToken = function(token) {
        $window.localStorage[tokenName] = token;
    };
    authService.getToken = function() {
        return $window.localStorage[tokenName];
    };
    authService.getHeader = function() {
        return {
            headers: { Authorization: 'Bearer ' + authService.getToken() },
            timeout: 5000
        };
    };
    authService.getPayload = function() {
        var token = authService.getToken();
        if (token) {
            return JSON.parse($window.atob(token.split('.')[1]));
        } else {
            return null;
        }
    };
    authService.isLoggedIn = function() {
        var payload = authService.getPayload();
        if (payload) {
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    authService.currentUser = function() {
        if (authService.isLoggedIn()) {
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
} ]);

},{}],15:[function(require,module,exports){
app.factory('$googleImageSearch', [function() {

    var searcher = {};
    searcher.getImage = function(query, callback) {
        var imageSearch = new google.search.ImageSearch();
        imageSearch.setSearchCompleteCallback(imageSearch, function() {
            if (imageSearch.results && imageSearch.results.length > 0) {
                callback(imageSearch.results[0]);
            }
        }, []);
        imageSearch.execute(query);
    };
    return searcher;
} ]);

},{}],16:[function(require,module,exports){
require('./authService.js');
require('./tripService.js');
require('./LxDatePicker.js');
require('./imageSearch.js');

},{"./LxDatePicker.js":13,"./authService.js":14,"./imageSearch.js":15,"./tripService.js":17}],17:[function(require,module,exports){
app.factory('tripService', ['$http', 'authService', function($http, authService) {
    var remoteUri = function(id) {
        if (id) { return '/trips/' + id; }
        else { return '/trips'; }
    };

    var tripService = {};

    tripService.Trip = require('../types/Trip.js');
    tripService.POI = require('../types/POI.js');
    tripService.Destination = require('../types/Destination');

    tripService.all = [];

    tripService.getIndexById = function(id) {
        var arrayObjectIndexOf = function(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) { return i; }
            }
            return -1;
        };
        return arrayObjectIndexOf(tripService.all, id, '_id');
    };
    tripService.getAll = function() {
        return $http.get(remoteUri(), authService.getHeader()).success(function(allTrips) {
            angular.copy(_.each(allTrips, function(t) { new tripService.Trip(t); }), tripService.all);
        });
    };
    tripService.create = function(trip) {
        return $http.post(remoteUri(), trip, authService.getHeader()).success(function(remoteTrip) {
            tripService.all.push(new tripService.Trip(remoteTrip));
        });
    };
    tripService.get = function(id) {
        return $http.get(remoteUri(id), authService.getHeader()).success(function(remoteTrip) {
            return remoteTrip;
        });
    };
    tripService.getDestination = function(tripId, destinationId) {
        return $http.get(remoteUri(tripId) + '/destination/' + destinationId,
                authService.getHeader()).success(function(remoteDestination) {
            return remoteDestination;
        });
    };
    tripService.remove = function(trip) {
        return $http.delete(remoteUri(trip._id), authService.getHeader()).success(function(remoteTrip) {
            var index = tripService.getIndexById(remoteTrip._id);
            if (index != -1) {
                tripService.all.splice(index, 1);
            }
        });
    };
    tripService.update = function(trip) {
        return $http.put(remoteUri(trip._id), trip, authService.getHeader()).success(function(remoteTrip) {
            var index = tripService.getIndexById(remoteTrip._id);
            if (index != -1) {
                tripService.all.splice(index, 1, new tripService.Trip(remoteTrip));
            }
        });
    };

    tripService.updateDestination = function(trip, destination) {
        destination.newHotel = destination.hotel; // This is a fix for a timing request bug.
        return $http.put(remoteUri(trip._id) + '/destination/' + destination._id,
                destination, authService.getHeader()).success(function(remoteDestination) {
            trip.updateDestination(destination, remoteDestination);
        });
    };

    return tripService;
} ]);

},{"../types/Destination":18,"../types/POI.js":19,"../types/Trip.js":20}],18:[function(require,module,exports){
var Destination = module.exports = function(destinationData) {
    destinationData = destinationData || {};
    destinationData.hotel = destinationData.hotel || {};
    this._id = destinationData._id || null;
    this.city = destinationData.city || '';
    this.image = destinationData.image || '';
    this.startDate = destinationData.startDate ? moment(destinationData.startDate) : moment().startOf('day');
    this.endDate = destinationData.endDate ? moment(destinationData.endDate) : moment().add(5, 'day');
    this.latitude = destinationData.latitude || 0;
    this.longitude = destinationData.longitude || 0;
    this.pois = destinationData.pois || [];
    this.hotel = {
        name: destinationData.hotel.name,
        icon: destinationData.hotel.icon,
        ranking: destinationData.hotel.ranking,
        address: destinationData.hotel.address,
        phone: destinationData.hotel.phone,
        latitude: destinationData.hotel.latitude,
        longitude: destinationData.hotel.longitude
    };
    /* Clone this destination */
    this.clone = function() { return new Destination(this); };
    /* Set this object's data to that of reseter */
    this.resetTo = function(reseter) {
        this._id = reseter._id;
        this.city = reseter.city;
        this.image = reseter.image;
        this.startDate = reseter.startDate;
        this.endDate = reseter.endDate;
        this.latitude = reseter.latitude;
        this.longitude = reseter.longitude;
        this.pois = reseter.pois;
        reseter.hotel = reseter.hotel || {};
        this.hotel = {
            name: reseter.hotel.name,
            icon: reseter.hotel.icon,
            ranking: reseter.hotel.ranking,
            address: reseter.hotel.address,
            phone: reseter.hotel.phone,
            latitude: reseter.hotel.latitude,
            longitude: reseter.hotel.longitude
        };
    };
    this.getImage = function() {
        return this.image ? this.image : 'http://p1.pichost.me/640/34/1569306.jpg';
    };
    /* Return true if this destination dates are valid, that is, they are setted, and
     * the endDate is after the startDate
     */
    this.hasValidDates = function() {
        return !this.startDate || !this.endDate || this.startDate.isBefore(this.endDate);
    };
    /* Return true if this destination is ready to save in the server. That is, it has a valid
     * city, and valid dates, non of them empty.
     */
    this.readyToSave = function() {
        return (this.startDate && this.endDate && (this.title !== '') && this.hasValidDates()) === true;
    };

    this.addPOI = function(poi) {
        this.pois.push(poi);
    };
    this.removePOI = function(poi) {
        var index = this.pois.indexOf(poi);
        if (index != -1) {
            this.pois.splice(index, 1);
        }
    };
};

},{}],19:[function(require,module,exports){
var POI = module.exports = function(poiData) {
    poiData = poiData || {};
    this._id = poiData._id || null;
    this.name = poiData.name || '';
    this.icon = poiData.icon || '';
    this.address = poiData.address || '';
    this.description = poiData.description || '';
    this.ranking = poiData.ranking || 0;
    this.latitude = poiData.latitude || 0;
    this.longitude = poiData.longitude || 0;
    /*Clone this trip into a new one */
    this.clone = function() { return new POI(this);};
    /* Set this object's data to that of reseter */
    this.resetTo = function(reseter) {
        this._id = reseter._id;
        this.name = reseter.name;
        this.icon = reseter.icon;
        this.address = reseter.address;
        this.description = reseter.description;
        this.ranking = reseter.ranking;
        this.latitude = reseter.latitude;
        this.longitude = reseter.longitude;
    };
    this.readyToSave = function() {
        return this.name;
    };
};

},{}],20:[function(require,module,exports){
var Destination = require('./Destination.js');

var Trip = module.exports = function(tripData) {
    tripData = tripData || {};
    this._id = tripData._id || null;
    this.title = tripData.title || '';
    this.startDate = tripData.startDate ? moment(tripData.startDate) : moment().startOf('day');
    this.endDate = tripData.endtDate ? moment(tripData.endDate) : moment().add(15, 'day');
    this.destinations = _.map(tripData.destinations || [], function(dest) {
        return typeof(dest) === 'object' ? new Destination(dest) : dest;
    });
    /* Clone this trip into a new one */
    this.clone = function() { return new Trip(this);};
    /* Set this object's data to that of reseter */
    this.resetTo = function(reseter) {
        this._id = reseter._id;
        this.title = reseter.title;
        this.startDate = reseter.startDate;
        this.endDate = reseter.endDate;
        this.destinations = [];
        angular.copy(reseter.destinations, this.destinations);
    };
    this.getImage = function() {
        var destinationWithImage = {};
        if (this.destinations.length > 0) {
            destinationWithImage = _.find(this.destinations, function(destination) {
                return destination.image;
            });
        }
        return destinationWithImage.image || 'http://www.myfreephotoshop.com/wp-content/uploads/2014/10/223.jpg';
    };
    /* Return true if this trips dates are valid, that is, they are setted, and
     * the endDate is after the startDate
     */
    this.hasValidDates = function() {
        return !this.startDate || !this.endDate || this.startDate.isBefore(this.endDate);
    };
    /* Return true if this trip is ready to save in the server. That is, it has a valid
     * title, and valid dates, non of them empty.
     */
    this.readyToSave = function() {
        return (this.startDate && this.endDate && (this.title !== '') && this.hasValidDates()) === true;
    };
    /* Add a destination to this trip */
    this.addDestination = function(destination) {
        this.destinations.push(destination);
    };
    /* Remove a destination from this trip. The destination should be present in this trip. */
    this.removeDestination = function(destination) {
        var index = this.destinations.indexOf(destination);
        if (index != -1) {
            this.destinations.splice(index, 1);
        }
    };
    /* Remove a destination from this trip. The destination should be present in this trip. */
    this.updateDestination = function(oldDestination, newDestination) {
        var index = this.destinations.indexOf(oldDestination);
        if (index != -1) {
            this.destinations.splice(index, 1, newDestination);
        }
    };
};

},{"./Destination.js":18}]},{},[1]);
