logger.info("Creating Destination Schema");

var DestinationSchema = new mongoose.Schema({
    city: String,
    startDate: Date,
    endDate: Date,
    location: {latitude: Number,longitude: Number},
    image: {data: Buffer, contentType: String}
    // activities: [{type: ActivitySchema}]
});

module.exports = mongoose.model("Destination", DestinationSchema);
