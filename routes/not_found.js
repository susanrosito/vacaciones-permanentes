logger.info("Defining 404 page not found actions...");

var router = express.Router();

router.use(function(req, res){
    res.status(404);
    logger.warn("NOT FOUND");
    // respond with html page
    if (req.accepts('html')) {
        res.render("404");
    }
    // respond with json
    else if (req.accepts('json')) {
        res.send({ error: 'Not found' });
    }
    // default to plain-text. send()
    else {
        res.type('txt').send('Not found');
    }
});

module.exports = router;