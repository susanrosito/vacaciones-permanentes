module.exports = Trip = function(tripData) {
    tripData = tripData || {};
    this._id = tripData._id || null;
    this.title = tripData.title || '';
    this.startDate = tripData.startDate ? moment(tripData.startDate) : moment().startOf('day');
    this.endDate = tripData.endtDate ? moment(tripData.endDate) : moment().add(15, 'day');
    this.destinations = tripData.destinations || [];
    /*Clone this trip into a new one */
    this.clone = function() { return new Trip(this);};
    /* Set this object's data to that of reseter */
    this.resetTo = function (reseter) {
        this._id = reseter._id;
        this.title = reseter.title;
        this.startDate = reseter.startDate;
        this.endDate = reseter.endDate;
        this.destinations = [];
        angular.copy(reseter.destinations, this.destinations);
    };
    /* Return true if this trips dates are valid, that is, they are setted, and
     * the endDate is after the startDate
     */
    this.hasValidDates = function () {
        return !this.startDate || !this.endDate || this.startDate.isBefore(this.endDate);
    };
    /* Return true if this trip is ready to save in the server. That is, it has a valid
     * title, and valid dates, non of them empty.
     */
    this.readyToSave = function () {
        return (this.startDate && this.endDate && !(this.title === '') && this.hasValidDates()) == true;
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

    /*
    this.hasDestinationValidDates = function(destination){
        return destination.startDate >= this.startDate && destination.startDate <= this.endDate &&
                destination.endDate <= this.endDate && destination.endDate >= this.startDate;
    };
    this.hasBetweenDestinationValidDates = function(destination){
        var isValidDates = this.hasDestinationValidDates(destination);

        return isValidDates  && _.all(this.destinations, function(dest){
                    return destination.startDate >= dest.endDate || destination.endDate <= dest.startDate;
                });
    };
    */
};