app.controller('NavigationCtrl', ['$state', '$scope', '$window', 'authService', function(
        $state, $scope, $window, authService) {

    var SIDEBAR_VISIBLE_DEFAULT_SIZE = 1024;

    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.currentUser = authService.currentUser;

    $scope.logOut = function() {
        authService.logOut();
        $state.go('login');
    };

    function updateSidebar() {
        $scope.isVisibleByWidth = $window.innerWidth > SIDEBAR_VISIBLE_DEFAULT_SIZE;
        $scope.isSidebarToggled = $scope.isVisibleByWidth;
    }
    updateSidebar();

    $scope.isSidebarVisible = function() {
        return ($scope._isSidebarToggled || $scope.isVisibleByWidth())  && $scope.isLoggedIn;
    };

    $scope.toggleSidebar = function() {
        if (!$scope.isVisibleByWidth) {
            $scope.isSidebarToggled = !$scope.isSidebarToggled;
        }
    };

    angular.element($window).bind('resize', function() { $scope.$apply(updateSidebar); });
    $scope.$on('$destroy', function() { angular.element($window).off('resize'); });
}]);
