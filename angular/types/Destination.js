var Destination = module.exports = function(destinationData) {
    destinationData = destinationData || {};
    destinationData.hotel = destinationData.hotel || {};
    this._id = destinationData._id || null;
    this.city = destinationData.city || '';
    this.image = destinationData.image || '';
    this.startDate = destinationData.startDate ? moment(destinationData.startDate) : moment().startOf('day');
    this.endDate = destinationData.endDate ? moment(destinationData.endDate) : moment().add(5, 'day');
    this.latitude = destinationData.latitude || 0;
    this.longitude = destinationData.longitude || 0;
    this.pois = destinationData.pois || [];
    this.hotel = {
        name: destinationData.hotel.name,
        icon: destinationData.hotel.icon,
        ranking: destinationData.hotel.ranking,
        address: destinationData.hotel.address,
        phone: destinationData.hotel.phone,
        latitude: destinationData.hotel.latitude,
        longitude: destinationData.hotel.longitude
    };
    /* Clone this destination */
    this.clone = function() { return new Destination(this); };
    /* Set this object's data to that of reseter */
    this.resetTo = function(reseter) {
        this._id = reseter._id;
        this.city = reseter.city;
        this.image = reseter.image;
        this.startDate = reseter.startDate;
        this.endDate = reseter.endDate;
        this.latitude = reseter.latitude;
        this.longitude = reseter.longitude;
        this.pois = reseter.pois;
        reseter.hotel = reseter.hotel || {};
        this.hotel = {
            name: reseter.hotel.name,
            icon: reseter.hotel.icon,
            ranking: reseter.hotel.ranking,
            address: reseter.hotel.address,
            phone: reseter.hotel.phone,
            latitude: reseter.hotel.latitude,
            longitude: reseter.hotel.longitude
        };
    };
    this.getImage = function() {
        return this.image ? this.image : 'http://p1.pichost.me/640/34/1569306.jpg';
    };
    /* Return true if this destination dates are valid, that is, they are setted, and
     * the endDate is after the startDate
     */
    this.hasValidDates = function() {
        return !this.startDate || !this.endDate || this.startDate.isBefore(this.endDate);
    };
    /* Return true if this destination is ready to save in the server. That is, it has a valid
     * city, and valid dates, non of them empty.
     */
    this.readyToSave = function() {
        return (this.startDate && this.endDate && (this.title !== '') && this.hasValidDates()) === true;
    };

    this.addPOI = function(poi) {
        this.pois.push(poi);
    };
    this.removePOI = function(poi) {
        var index = this.pois.indexOf(poi);
        if (index != -1) {
            this.pois.splice(index, 1);
        }
    };
};
