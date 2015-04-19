app.controller('NavigationCtrl', ['$scope', '$mdSidenav', 'authService', function($scope, $mdSidenav, authService) {

    $scope.isLoggedIn = authService.isLoggedIn;

    $scope.currentUser = authService.currentUser;

    $scope.logOut = function() {
        authService.logOut();
        $scope.toggleRight();
    };

    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };

    $scope.toggleRight = function() {
        $mdSidenav('right').toggle();
    };
}]);
