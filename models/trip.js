logger.info("Creating Trip Schema");

var TripSchema = new mongoose.Schema({
    creationDate: {type: Date, default: Date.now },
    author: String,
    title: String,
    startDate: {type: Date },
    endDate: {type: Date}
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
});

module.exports = mongoose.model("Trip", TripSchema);
