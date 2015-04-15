logger.info("Creating static assets routes...");

var router = express.Router();

_.each(config.assets, function(asset){
    logger.info("    Will serve statically files at \"%s\" at \"%s\"",
        asset.folder, (asset.path ? asset.path : "/"));
    router.use((asset.path ? asset.path : "/"), express.static(asset.folder));
});

module.exports = router;