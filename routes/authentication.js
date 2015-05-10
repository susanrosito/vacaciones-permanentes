logger.info(__('Creating authentication routes...'));

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');

var router = module.exports =  express.Router();

passport.use(new LocalStrategy({ usernameField: 'email' },
    function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err); }
            if (!user) {
                return done(null, false, 'There is no user with that email registered');
            }
            if (!user.validPassword(password)) {
                return done(null, false, 'The email and password do not match');
            }
            return done(null, user);
        });
    }
));

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


