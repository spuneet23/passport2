var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User Schema 
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type:String
	},
	email: {
		type: String,
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

// Create User
module.exports.createUser = function(newUser, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
});
}

// Get User by Username
module.exports.getUserByUsername = function(username, callback) {
   var query = {username: username};
   User.findOne(query, callback);
}

// Get User by Id
module.exports.getUserById = function(id, callback) {
   User.findById(id, callback);
}

// Compare Passwords
module.exports.comparePassword = function(candidatePassword,hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    	if(err) throw err;
    	callback(null, isMatch);
    })
}