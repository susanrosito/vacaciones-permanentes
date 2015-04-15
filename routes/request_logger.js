var router = express.Router();

router.use(function(req, res, next){
    logger.info("%s Request to \"%s\"", req.method, req.originalUrl);
    next();
});

module.exports = router;