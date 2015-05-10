logger.info(__('Creating Trip Schema'));

var TripSchema = new mongoose.Schema({
    creationDate: {type: Date, default: Date.now },
    title: String,
    startDate: {type: Date },
    endDate: {type: Date},
    user: { type: ObjectId, ref: 'User' },
    destinations: [{ type: ObjectId, ref: 'Destination' }]
});

TripSchema.methods.belongsTo = function(user){
    return this.user.equals(user._id);
};

TripSchema.methods.addDestination = function(destination){
  this.destinations.push(destination);
};

module.exports = mongoose.model("Trip", TripSchema);
