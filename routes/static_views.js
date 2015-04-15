logger.info("Creating static views routes...");

var router = express.Router();

_.each(config.views, function(view){
    logger.info("    Will serve \"%s\" at \"%s\"", view.file, view.paths.join("\", \""));
    _.each(view.paths, function(path){
        router.use(path, function(req, res) {
            res.render(view.file);
        });
    });
});

router.get("/", function(req, res, next){
    res.render(config.views.root)
});

module.exports = router;