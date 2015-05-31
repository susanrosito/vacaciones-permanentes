module.exports = POI = function(poiData) {
    poiData = poiData || {};
    this._id = poiData._id || null;
    this.name = poiData.name || '';
    this.address = poiData.address || '';
    this.description = poiData.description || '';
    this.ranking = poiData.ranking || -1;
    this.latitude = poiData.latitude || 0;
    this.longitude = poiData.longitude || 0;
    /*Clone this trip into a new one */
    this.clone = function() { return new POI(this);};
    /* Set this object's data to that of reseter */
    this.resetTo = function (reseter) {
        this._id = reseter._id;
        this.name = reseter.name;
        this.address = reseter.address;
        this.description = reseter.description;
        this.ranking = reseter.ranking;
        this.latitude = reseter.latitude;
        this.longitude = reseter.longitude;
    };
    this.readyToSave = function() {
        return this.name;
    }
};