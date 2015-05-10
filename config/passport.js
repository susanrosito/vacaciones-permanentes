var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');

passport.use(new LocalStrategy(
    function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
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
