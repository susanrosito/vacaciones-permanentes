logger.info("Creating Destination Schema");

var relationship = require("mongoose-relationship");

var DestinationSchema = module.exports = new mongoose.Schema({
    trip: { type: ObjectId, ref:"Trip", childPath:"destinations" },
    city: String,
    startDate: Date,
    endDate: Date,
    latitude: Number,
    longitude: Number
    //}
    // image: {data: Buffer, contentType: String}
    // activities: [{type: ActivitySchema}]
});
DestinationSchema.plugin(relationship, { relationshipPathName: 'trip' });