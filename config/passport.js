var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, 'There is no user with that email registered');
            }
            if (!user.validPassword(password)) {
                return done(null, false, 'The username and password do not match');
            }
            return done(null, user);
        });
    }
));
