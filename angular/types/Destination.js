module.exports = Destination = function(destinationData) {
    destinationData = destinationData || {};
    this._id = destinationData._id || null;
    this.city = destinationData.city || '';
    this.startDate = destinationData.startDate ? moment(destinationData.startDate) : moment().startOf('day');
    this.endDate = destinationData.endDate ? moment(destinationData.endDate) : moment().add(5, 'day');
    this.latitude = destinationData.latitude || 0;
    this.longitude = destinationData.longitude || 0;
    this.pois = destinationData.pois || [];
    /* Clone this destination */
    this.clone = function() {return new Destination(this);};
    /* Set this object's data to that of reseter */
    this.resetTo = function (reseter) {
        this._id = reseter._id;
        this.city = reseter.city;
        this.startDate = reseter.startDate;
        this.endDate = reseter.endDate;
        this.latitude = reseter.latitude;
        this.longitude = reseter.longitude;
        this.pois = reseter.pois;
    };
    /* Return true if this destination dates are valid, that is, they are setted, and
     * the endDate is after the startDate
     */
    this.hasValidDates = function () {
        return !this.startDate || !this.endDate || this.startDate.isBefore(this.endDate);
    };
    /* Return true if this destination is ready to save in the server. That is, it has a valid
     * city, and valid dates, non of them empty.
     */
    this.readyToSave = function () {
        return (this.startDate && this.endDate && !(this.title === '') && this.hasValidDates()) == true;
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