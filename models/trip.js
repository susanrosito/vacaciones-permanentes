logger.info(__('Creating Trip Schema'));

var Destination = mongoose.model('Destination');

var TripSchema = new mongoose.Schema({
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
TripSchema.methods.updateDestinations = function(newTrip) {

    var destinationsToRemove = this.destinationsNotIn(newTrip.destinations);
     Destination.find({_id: {$in: destinationsToRemove}}).remove();
    var self = this;
    var destinationsNotSaved = _.filter(newTrip.destinations, function(dest) {
        return !self.hasDestination(dest);
    });
    return {
        toRemove: destinationsToRemove,
        toAdd: _.map(destinationsNotSaved, function (each) {
            var dest = new Destination(each);
            dest.save();
            return dest._id;
        })
    };
};

TripSchema.methods.hasDestination = function(destination) {
    return destination._id && ObjectId.isValid(destination._id) &&
            _.contains(this.destinations, destination._id);
};
TripSchema.methods.destinationsNotIn = function(destinationList) {
    var destIds = _.map(destinationList, function(e) {return e._id;});
    return _.filter(this.destinations, function(each) {
        return !_.contains(destIds, each);
    });
};
TripSchema.methods.addDestination = function(destination) {
    this.destinations.push(destination._id);
};
TripSchema.methods.removeDestination = function(destination) {
    this.destinations.push(destination._id);
};

module.exports = mongoose.model("Trip", TripSchema);
