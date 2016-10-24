var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//video Schema 
var monitorSchema = mongoose.Schema({
	deviceId: {
		type: String
	},
	location: {
      type: String
	},
	location_lat: {
		type:Number
	},
	location_lng: {
       type:Number
	},
	password:{
       type:String
	},
	added: {
		type: Date,
		default: Date.now
	}
});

var Monitor = module.exports = mongoose.model('Monitor', monitorSchema);

// Create Device
module.exports.saveDevice = function(device, callback) {
   device.save(callback);
}

//Get Videos
module.exports.getVideos = function(query, callback, limit) {
	Video.find(query, callback).limit(limit);
}