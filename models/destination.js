logger.info("Creating Destination Schema");

var relationship = require("mongoose-relationship");

var DestinationSchema = module.exports = new mongoose.Schema({
    trip: { type: ObjectId, ref:"Trip", childPath:"destinations" },
    city: String,
    startDate: Date,
    endDate: Date,
    latitude: Number,
    longitude: Number,
    pois: [{type: ObjectId, ref:'POI'}]
});

DestinationSchema.methods.getFilteredPOIs = function (pois) {

    var poisIds = _.map(pois, function (e) {
        return e._id;
    });

    var poisToRemove = _.filter(this.pois, function (each) {
        return !_.some(poisIds, function (id) {
            return each.equals(id)
        });
    });
    var poisToAdd = _.filter(pois, function (each) {
        return !each._id;
    });
    return {
        toRemove: poisToRemove,
        toAdd: poisToAdd
    };
};

DestinationSchema.plugin(relationship, { relationshipPathName: 'trip' });