var config = require('../../config');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.mongo.connectionString(), function(err, db) {
    if (err) { process.exit(1); }
    db.dropDatabase();
    setTimeout(function() { process.exit(0); }, 1000);
});