var exports = module.exports = {};
exports.getTrip = ['$stateParams', 'LxNotificationService', 'gettextCatalog', 'tripService',
    function($stateParams, LxNotificationService, gettextCatalog, tripService) {
    var result =  tripService.get($stateParams.id);
    result.error(function(err) {
        LxNotificationService.error(gettextCatalog.getString(err.message));
    });
    return result.then(function(res) {
        return new tripService.Trip(res.data);
    });
}];

exports.getDestination = ['$stateParams', 'LxNotificationService', 'gettextCatalog', 'tripService',
    function($stateParams, LxNotificationService, gettextCatalog, tripService) {
        var result =  tripService.getDestination($stateParams.id, $stateParams.destinationId);
        result.error(function(err) {
            LxNotificationService.error(gettextCatalog.getString(err.message));
        });
        return result.then(function(res) {
            return new tripService.Destination(res.data);
        });
    }];

exports.getAllTrips = ['tripService', function (tripService) {
    return tripService.getAll();
}];

exports.goToLoginTimedOut = ['$timeout', '$state', 'authService', function($timeout, $state, authService) {
    $timeout(function () {
        if (!authService.isLoggedIn()) { $state.go('login'); }
    });
}];

exports.goToLogin = ['$state', 'authService', function($state, authService) {
    if (!authService.isLoggedIn()) { $state.go('login'); }
}];

exports.goToHome = ['$state', 'authService', function($state, authService) {
    if (authService.isLoggedIn()) { $state.go('home'); }
}];