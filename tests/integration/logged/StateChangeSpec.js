require('./../testRunner');

describe('When logged in', function() {

    it('going to login should redirect to home', function() {
        goTo('login');
        expect(browser.getCurrentUrl()).toContain(site.urlFor('home'));
    });

    it('going to registration should redirect to home', function() {
        goTo('register');
        expect(browser.getCurrentUrl()).toContain(site.urlFor('home'));
    });

});