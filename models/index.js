logger.info(__('Creating models...'));

module.exports = {
    Trip: require("./user.js"),
    User: require("./trip.js"),
    Destination: require("./destination.js")
};
