logger.info(__('Creating models...'));

module.exports = {
    User: require("./user.js"),
    Destination: require("./destination.js"),
    Trip: require("./trip.js")
};
