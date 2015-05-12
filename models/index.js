logger.info(__('Creating models...'));

var UserSchema = require("./user.js");
var DestinationSchema = require("./destination.js");
var TripSchema = require("./trip.js");

mongoose.model('User', UserSchema);
mongoose.model("Destination", DestinationSchema);
mongoose.model("Trip", TripSchema);
