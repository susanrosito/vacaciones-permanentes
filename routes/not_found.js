logger.info(__('Defining 404 page not found actions...'));

var fs = require('fs');

var router = module.exports = express.Router();

router.use(function(req, res){
    res.status(404);
    logger.info(__('NOT FOUND'));
    if (req.accepts('html')) {
        res.status(404).send(fs.readFileSync('public/404.html'));
    }
    else if (req.accepts('json')) {
        res.send({
            error: 'Not found',
            status: 404
        });
    }
    else {
        res.type('txt').send('Not found');
    }
});
