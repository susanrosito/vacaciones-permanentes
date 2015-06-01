logger.info("Creating POI Schema");

var relationship = require("mongoose-relationship");

var POISchema = module.exports = new mongoose.Schema({
    destination: { type: ObjectId, ref:"Destination", childPath:"pois" },
    name: String,
    icon: String,
    address: String,
    description: String,
    ranking: Number,
    latitude: Number,
    longitude: Number
});
POISchema.plugin(relationship, { relationshipPathName: 'destination' });