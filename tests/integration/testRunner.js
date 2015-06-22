// Define the site address and states for easier testing

global.waitForPromise = function(promiseFn, testFn) {
    browser.wait(function () {
        var deferred = protractor.promise.defer();
        promiseFn().then(function (data) {
            deferred.fulfill(testFn(data));
        });
        return deferred.promise;
    });
};

global.site = {};
global.site.url = 'http://localhost:3000/';
global.site.states = {
    'home': global.site.url + '#/home',
    'login': global.site.url + '#/login',
    'register': global.site.url + '#/register',
    'trip': global.site.url + '#/trip/:id',
    'destination': global.site.url + '#/destination/:id'
};
global.site.urlFor = function(state, context) {
    var uri = this.states[state];
    if (context) {
        for (var key in context) {
            uri = uri.replace(':' + key, context[key]);
        }
    }
    return uri;
};
global.site.isUrl = function(url, state) {
    return url.indexOf(this.states[state]) !== -1;
};

// Define helper global functions
global.goTo = function(state, context) {
    browser.get(site.urlFor(state, context) || site.url);
    browser.waitForAngular();
};

global.logInAs = function(email, password) {
    browser.wait(function() {
        return element(by.id('login')).isPresent(); // keeps waiting until this statement resolves to true
    }, 3000, 'Timed out waiting for email to appear when logging in'
    );
    element(by.id('email')).sendKeys(email);
    element(by.id('password')).sendKeys(password);
    element(by.id('log-in')).click();
    browser.waitForAngular();
};

global.logOut = function() {
    element(by.id('user-account-menu')).click();
    element(by.id('log-out')).click();
    browser.wait(function() {
        return element(by.id('login')).isPresent(); // keeps waiting until this statement resolves to true
    }, 3000, 'Timed out waiting for email to appear after logout'
    );
};

