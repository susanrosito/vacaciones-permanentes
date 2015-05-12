app.controller('AuthCtrl', ['$scope', '$state', '$focus', 'LxNotificationService', 'gettextCatalog', 'authService', function(
        $scope, $state, $focus, LxNotificationService, gettextCatalog, authService) {

    $scope.user = { name: '', email : '', password: '', passwordRepeat: '' };
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
}]);
