describe('NavigationCtrl', function() {
    var scope, controller, window, authServiceMock;

    beforeEach(function() {
        module('vacacionesPermanentes');
    });

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
        scope = $rootScope.$new();
        $httpBackend.expectGET('/locales/es.json').respond(200, {});
        $httpBackend.expectGET('/home.html').respond(200, '');
        authServiceMock = {
            isLoggedIn: function() { return true; },
            currentUser: function() {
                return { name: 'Someone', email: 'someone@company.com' };
            }
        };
        window = { innerWidth: 1025 };
        controller = $controller('NavigationCtrl', {
            $window: window,
            $scope: scope,
            authService: authServiceMock
        });
    }));

    it('Scope is logged in and current user matches the one fetched by authService', function() {
        expect(scope.isLoggedIn()).toEqual(true);
        expect(scope.currentUser().name).toEqual('Someone');
        expect(scope.currentUser().email).toEqual('someone@company.com');
    });

    it('Sidebar is visible if window width is greater than 1024', function() {
        expect(scope.isVisibleByWidth).toEqual(true);
    });

    it('Sidebar is not visible if window width is lower or equal than 1024', function() {
        window.innerWidth = 1000;
        // simulate window resize
        var e = $.Event('resize');
        angular.element(window).triggerHandler(e);
        expect(scope.isVisibleByWidth).toEqual(false);
        window.innerWidth = 1024;
        // simulate window resize
        angular.element(window).triggerHandler(e);
        expect(scope.isVisibleByWidth).toEqual(false);
    });

    it('Sidebar toggles correctly', function() {
        window.innerWidth = 1000;
        // simulate window resize
        var e = $.Event('resize');
        angular.element(window).triggerHandler(e);
        expect(scope.isSidebarToggled).toEqual(false);
        scope.toggleSidebar();
        expect(scope.isSidebarToggled).toEqual(true);
        scope.toggleSidebar();
        expect(scope.isSidebarToggled).toEqual(false);
    });
});
