var router = module.exports = express.Router();

router.use(function(req, res, next){
    logger.info(__('%s Request to "%s"', [req.method, req.originalUrl]));
    next();
});
