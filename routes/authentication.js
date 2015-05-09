logger.info(__('Creating authentication routes...'));

var passport = require('passport');

var User = mongoose.model('User');

var router = module.exports =  express.Router();

router.post('/register', function(req, res, next) {
    if(!req.body.email || !req.body.password) {
        return res.error(HTTPStatus.BAD_REQUEST, 'Please fill out all fields');
    }

    var user = new User();
    user.email = req.body.email;
    user.name = req.body.name;
    user.lang = 'es';
    user.setPassword(req.body.password);

    user.save(function (err){
        if(err){ return next(err); }
        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function(req, res, next) {
    if(!req.body.email || !req.body.password) {
        return res.error(HTTPStatus.BAD_REQUEST, 'Please fill out all fields');
    }
    passport.authenticate('local', function(err, user, info) {
        if(err){ return next(err); }
        if(!user){ return res.error(HTTPStatus.UNAUTHORIZED, info); }
        return res.json({token: user.generateJWT()});
    })(req, res, next);
});
