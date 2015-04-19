app.controller('AddTripDialogCtrl', ['$scope', '$mdDialog', 'authService', 'tripService', function(
        $scope, $mdDialog, authService, tripService) {

    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.create = function () {
        if ((!$scope.title || $scope.title === '') &&
            (!$scope.startDate || $scope.startDate === '') &&
            (!$scope.endDate || $scope.endDate === '') &&
            (!$scope.startDate <= $scope.endDate)) {
            return;
        }
        tripService.create({
            title: $scope.title,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        });
        $scope.title = '';
        $scope.startDate = '';
        $scope.endDate = '';
        $mdDialog.hide();
    };
}]);