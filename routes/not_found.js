logger.info(__('Defining 404 page not found actions...'));

var router = module.exports = express.Router();

router.use(function(req, res) {
    res.status(404);
    logger.info(__('NOT FOUND'));
    if (req.accepts('html')) {
        res.status(404).send('No se ha encontrado la página solicitada');
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
