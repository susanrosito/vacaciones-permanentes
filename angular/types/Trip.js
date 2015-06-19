var Destination = require('./Destination.js');

var Trip = module.exports = function(tripData) {
    tripData = tripData || {};
    this._id = tripData._id || null;
    this.title = tripData.title || '';
    this.startDate = tripData.startDate ? moment(tripData.startDate) : moment().startOf('day');
    this.endDate = tripData.endtDate ? moment(tripData.endDate) : moment().add(15, 'day');
    this.destinations = _.map(tripData.destinations || [], function(dest) {
        return typeof(dest) === 'object' ? new Destination(dest) : dest;
    });
    /* Clone this trip into a new one */
    this.clone = function() { return new Trip(this);};
    /* Set this object's data to that of reseter */
    this.resetTo = function(reseter) {
        this._id = reseter._id;
        this.title = reseter.title;
        this.startDate = reseter.startDate;
        this.endDate = reseter.endDate;
        this.destinations = [];
        angular.copy(reseter.destinations, this.destinations);
    };
    this.getImage = function() {
        var destinationWithImage = {};
        if (this.destinations.length > 0) {
            destinationWithImage = _.find(this.destinations, function(destination) {
                return destination.image;
            });
        }
        return destinationWithImage.image || 'http://www.myfreephotoshop.com/wp-content/uploads/2014/10/223.jpg';
    };
    /* Return true if this trips dates are valid, that is, they are setted, and
     * the endDate is after the startDate
     */
    this.hasValidDates = function() {
        return !this.startDate || !this.endDate || this.startDate.isBefore(this.endDate);
    };
    /* Return true if this trip is ready to save in the server. That is, it has a valid
     * title, and valid dates, non of them empty.
     */
    this.readyToSave = function() {
        return (this.startDate && this.endDate && (this.title !== '') && this.hasValidDates()) === true;
    };
    /* Add a destination to this trip */
    this.addDestination = function(destination) {
        this.destinations.push(destination);
    };
    /* Remove a destination from this trip. The destination should be present in this trip. */
    this.removeDestination = function(destination) {
        var index = this.destinations.indexOf(destination);
        if (index != -1) {
            this.destinations.splice(index, 1);
        }
    };
    /* Remove a destination from this trip. The destination should be present in this trip. */
    this.updateDestination = function(oldDestination, newDestination) {
        var index = this.destinations.indexOf(oldDestination);
        if (index != -1) {
            this.destinations.splice(index, 1, newDestination);
        }
    };
};
