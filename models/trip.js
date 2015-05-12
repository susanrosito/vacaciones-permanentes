logger.info(__('Creating Trip Schema'));

var TripSchema = module.exports = new mongoose.Schema({
    creationDate: {type: Date, default: Date.now },
    title: String,
    startDate: {type: Date },
    endDate: {type: Date},
    user: { type: ObjectId, ref: 'User' },
    destinations: [{type: ObjectId, ref: 'Destination'}]
});

TripSchema.methods.belongsTo = function(user){
    return this.user.equals(user._id);
};

TripSchema.methods.getFilteredDestinations = function(destinations) {

    var destinationIds = _.map(destinations, function(e) {return e._id;});

    var destinationsToRemove = _.filter(this.destinations, function(each) {
        return !_.some(destinationIds, function(id) { return each.equals(id) });
    });
    var destinationsToAdd = _.filter(destinations, function(each) {
        return !each._id;
    });
    return {
        toRemove: destinationsToRemove,
        toAdd: destinationsToAdd
    };
};

TripSchema.methods.addDestination = function(destination) {
    this.destinations.push(destination._id);
};
TripSchema.methods.removeDestination = function(destination) {
    this.destinations.push(destination._id);
};


