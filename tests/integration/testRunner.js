global.loggedIn = function(tests) {
    browser.get('http://localhost:3000');
    browser.waitForAngular();
    browser.getCurrentUrl().then(function(url) {
        if (url.indexOf('#/login') === -1) {
            element(by.id('email')).sendKeys('someone@company.com');
            element(by.id('password')).sendKeys('1234');
            element(by.id('log-in')).click();
            browser.waitForAngular();
        }
        tests();
    });
};

global.notLogged = function(tests) {
    tests();
};