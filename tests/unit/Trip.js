describe('Trip', function() {
    var Trip, trip;

    beforeEach(function() { module('vacacionesPermanentes'); });
    beforeEach(inject(function(tripService) {
        Trip = tripService.Trip;
        trip = new Trip();
    }));

    it('Newly created trip is not ready to save', function() {
        expect(trip.readyToSave()).toBe(false);
    });

    it('Newly created trip has valid dates', function() {
        expect(trip.hasValidDates()).toBe(true);
    });

    it('Trip with and date lower than start date is does not have valid dates', function() {
        trip.endDate = trip.startDate;
        expect(trip.hasValidDates()).toBe(false);
    });
});
