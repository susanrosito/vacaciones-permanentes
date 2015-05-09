logger.info(__('Creating User Schema'));

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    email: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String,
    language: {type: String, lowercase: true, default: 'es'},
    name: { type: String, default: '' }
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        language: this.language,
        exp: parseInt(exp.getTime() / 1000)
    }, config.auth.secret);
};

module.exports = mongoose.model('User', UserSchema);
