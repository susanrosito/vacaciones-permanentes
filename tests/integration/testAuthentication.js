require('./testRunner');

describe('When authenticating', function() {

    it('should log in correctly', function() {
        browser.get('http://localhost:3000');
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toContain('#/login');
        element(by.id('email')).sendKeys('someone@company.com');
        element(by.id('password')).sendKeys('1234');
        element(by.id('log-in')).click();
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toContain('#/home');
    });
});