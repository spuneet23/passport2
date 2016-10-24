var express = require('express');
var router = express.Router();
var Monitor = require('../models/monitors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var GooglePlaces = require('googleplaces');
// var places = new GooglePlaces('AIzaSyA29YB0yR63S9R6fxTGsmkVGGS5giSpmPM');
var Client = require('node-rest-client').Client;
var googleKey= 'AIzaSyA29YB0yR63S9R6fxTGsmkVGGS5giSpmPM';
var client = new Client();
 


function ensureAuthenticated(req,res,next) {
   if(req.isAuthenticated()) {
      return next();
   } else {
      console.log("You are not logged in");
      req.flash('error', 'You are not logged in');
      res.redirect('/');
   }
}

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('monitors', { title: 'monitors', layout: 'dashboard_layout' });
});

router.get('/new', ensureAuthenticated, function(req, res, next) {

	res.render('add_monitor', {layout: 'dashboard_layout'});
});

router.post('/add', ensureAuthenticated, function(req,res,nex) {
    var deviceId = req.body.deviceId;
    var location = req.body.location;
    var pwd = req.body.pwd;
    var cpwd = req.body.cpwd;
    var location_lat;
    var location_lng;

       // direct way 
    client.get("https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key="+googleKey, function (data, response) {
      // parsed response body as js object 
     location_lat=data.results[0].geometry.location.lat;
     location_lng=data.results[0].geometry.location.lng;
     // location_lat=location_lat.toString();
     // location_lng
         if(location_lat!="" && location_lng!="") {
        var newDevice = new Monitor({
           deviceId: deviceId,
           location: location,
           location_lat: location_lat,
           location_lng: location_lng,
           password: pwd

        });

        Monitor.saveDevice(newDevice, function(err, user){
            if (err) {
              res.send(err);
            }
            else {
              req.flash('success', 'You are now registered');
                res.redirect('/monitors');
            }
        });
      }
  });
    

});



module.exports = router;