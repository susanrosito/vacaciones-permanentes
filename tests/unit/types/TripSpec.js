describe('Trip', function() {
    var Trip, trip, Destination;

    beforeEach(function() { module('vacacionesPermanentes'); });
    beforeEach(inject(function(tripService) {
        Trip = tripService.Trip;
        Destination = tripService.Destination;
        trip = new Trip();
    }));

    it('Newly created trip is not ready to save', function() {
        expect(trip.readyToSave()).toBe(false);
    });

    it('Newly created trip has valid dates', function() {
        expect(trip.hasValidDates()).toBe(true);
    });

    it('Trip with end date lower or equal than start date does not have valid dates', function() {
        trip.endDate = trip.startDate;
        expect(trip.hasValidDates()).toBe(false);
        trip.startDate = trip.startDate.add(1, 'day');
        expect(trip.hasValidDates()).toBe(false);
    });

    it('A trip with no title is not ready to save', function() {
        expect(trip.title).toBe('');
        expect(trip.readyToSave()).toBe(false);
    });

    it('A trip invalid dates is not ready to save', function() {
        trip.title = 'MyTrip';
        trip.endDate = trip.startDate;
        expect(trip.readyToSave()).toBe(false);
        trip.startDate = trip.startDate.add(1, 'day');
        expect(trip.readyToSave()).toBe(false);
    });

    it('A trip with valid dates and title is ready to save', function() {
        trip.title = 'MyTrip';
        expect(trip.readyToSave()).toBe(true);
    });

    it('A newly created trip has no destinations', function() {
        expect(trip.destinations.length).toBe(0);
    });

    it('Add destinations to a trip adds it to its destination list', function() {
        var neverland = new Destination({ city: 'Neverland' });
        var wonderland = new Destination({ city: 'Wonderland' });
        trip.addDestination(neverland);
        trip.addDestination(wonderland);
        expect(trip.destinations.length).toBe(2);
        expect(trip.destinations.indexOf(neverland)).not.toBe(-1);
        expect(trip.destinations.indexOf(wonderland)).not.toBe(-1);
    });

    it('Remove destinations from a trip removes it from its destination list', function() {
        var neverland = new Destination({ city: 'Neverland' });
        var wonderland = new Destination({ city: 'Wonderland' });
        trip.addDestination(neverland);
        trip.addDestination(wonderland);
        expect(trip.destinations.length).toBe(2);
        trip.removeDestination(neverland);
        expect(trip.destinations.length).toBe(1);
        expect(trip.destinations.indexOf(neverland)).toBe(-1);
        expect(trip.destinations.indexOf(wonderland)).not.toBe(-1);
    });

    it('Update destination from a trip removes the old entry and adds the new one in place', function() {
        var neverland = new Destination({ city: 'Neverland' });
        var wonderland = new Destination({ city: 'Wonderland' });
        var smallville = new Destination({ city: 'Smallville' });
        trip.addDestination(neverland);
        trip.addDestination(wonderland);
        trip.addDestination(smallville);
        expect(trip.destinations.length).toBe(3);
        expect(trip.destinations[1]).toBe(wonderland);
        var maravillas = new Destination({ city: 'País de las Maravillas' });
        trip.updateDestination(wonderland, maravillas);
        expect(trip.destinations.length).toBe(3);
        expect(trip.destinations.indexOf(wonderland)).toBe(-1);
        expect(trip.destinations.indexOf(maravillas)).not.toBe(-1);
        expect(trip.destinations[1]).toBe(maravillas);
    });
});
