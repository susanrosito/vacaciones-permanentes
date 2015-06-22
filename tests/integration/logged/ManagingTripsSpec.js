require('./../testRunner');

describe('Add new trip', function() {

    it('Add a trip', function() {
        element(by.id('add-trip')).click();
        element(by.model('newTrip.title')).sendKeys('Neverland');
        element(by.id('create-trip-submit')).click();
    });

});
