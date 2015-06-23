require('./../testRunner');

describe('When not logged in', function() {

    it('should log in correctly with valid credential', function() {
        goTo('login');
        logInAs('someone@company.com', '1234');
        expect(browser.getCurrentUrl()).toContain(site.urlFor('home'));
        logOut();
    });

    it('should fail the login with invalid password', function() {
        goTo('login');
        logInAs('someone@company.com', 'wrongPassword');
        expect(browser.getCurrentUrl()).toContain(site.urlFor('login'));
    });

    it('should fail the login with invalid credentials', function() {
        goTo('login');
        logInAs('nonexistent@company.com', '1234');
        expect(browser.getCurrentUrl()).toContain(site.urlFor('login'));
    });

    it('going to any page should redirect to login', function() {
        goTo('home');
        expect(browser.getCurrentUrl()).toContain(site.urlFor('login'));
    });

});