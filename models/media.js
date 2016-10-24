var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//video Schema 
var VideoSchema = mongoose.Schema({
	name: {
		type: String
	},
	desc: {
		type:String
	},
	fileName:{
       type:String
	},
	uploaded: {
		type: Date,
		default: Date.now
	}
});

var Video = module.exports = mongoose.model('Video', VideoSchema);

// Create Video
module.exports.saveVideo = function(video, callback) {
   video.save(callback);
}

//Get Videos
module.exports.getVideos = function(query, callback, limit) {
	Video.find(query, callback).limit(limit);
}