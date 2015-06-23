describe('Destination', function() {
    var Destination, POI, dest, poi, img;
    img = 'http://politicacomunicada.com/wp-content/uploads/2014/05/buenos-aires.jpg';

    beforeEach(function() { module('vacacionesPermanentes'); });

    beforeEach(inject(function(tripService) {
        Destination = tripService.Destination;
        POI = tripService.POI;
        dest = new Destination();
        poi = new POI();
    }));

    it('Newly created destination is not ready to save', function() {
        expect(dest.readyToSave()).toBe(true);
    });

    it('Newly created destination has valid dates', function() {
        expect(dest.hasValidDates()).toBe(true);
    });

    it('Destination with and date lower than start date is does not have valid dates', function() {
        dest.endDate = dest.startDate;
        expect(dest.hasValidDates()).toBe(false);
    });

    it('Newly created destination has image ', function() {
        dest.image = img;
        expect(dest.getImage()).toBe(img);
    });

    it('Newly created destination without image set image default ', function() {
        expect(dest.getImage()).toBe('http://p1.pichost.me/640/34/1569306.jpg');
    });

    it('Newly created destination and call addPOI method with poi object', function() {
        dest.addPOI(poi);
        expect(dest.pois.length).toBe(1);
    });

    it('Newly created destination and call removePOI method', function() {
        dest.removePOI(poi);
        expect(dest.pois.length).toBe(0);
    });



});
