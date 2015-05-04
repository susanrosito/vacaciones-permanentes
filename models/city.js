logger.info("Creating City Schema");

var CitySchema = new mongoose.Schema({
    city: String,
    loc: {long: Number, lat: Number},
    img: {data: Buffer, contentType: String}
});

module.exports = mongoose.model("City", CitySchema);
