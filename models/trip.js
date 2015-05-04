logger.info(__('Creating Trip Schema'));

var TripSchema = new mongoose.Schema({
    creationDate: {type: Date, default: Date.now },
    author: String,
    title: String,
    startDate: {type: Date },
    endDate: {type: Date},
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }]
});

TripSchema.methods.addCity = function(city){
  this.cities.push(city);
};

module.exports = mongoose.model("Trip", TripSchema);
