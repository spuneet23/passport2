var express = require('express');
var router = express.Router();
var Video = require('../models/media');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer  = require('multer');
var upload = multer({ dest: 'upload/'});
var fs = require('fs');
var type = upload.single('video_source');

function ensureAuthenticated(req,res,next) {
   if(req.isAuthenticated()) {
      return next();
   } else {
      console.log("You are not logged in");
      req.flash('error', 'You are not logged in');
      res.redirect('/');
   }
}

router.get('/images', ensureAuthenticated, function(req, res) {
  res.render('media/images', {layout: 'dashboard_layout'});
});

router.get('/videos', ensureAuthenticated, function(req, res) {

  Video.getVideos(function(err, videos) {
     if(err) {
        res.send(err);
     } else {
         res.render('media/videos', {
            videos:videos,
            layout: 'dashboard_layout'
         });
     }
  });
 
});

router.get('/videos/new', ensureAuthenticated, function(req, res) {
  res.render('media/new_video', {layout: 'dashboard_layout'});
});

router.post('/videos/upload', ensureAuthenticated, type, function(req,res) {
   var name = req.body.video_name;
   var desc = req.body.video_desc;
   var org_video_name = req.file.originalname;
    
        var newVideo = new Video({
           name: name,
           desc: desc,
           fileName: org_video_name
        });

        Video.saveVideo(newVideo, function(err, user){
            if (err) {
              res.send(err);
            }
            else {
              req.flash('success', 'You are now registered');
                res.redirect('/dashboard');
            }
        });

   var tmp_path = req.file.path;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'uploads/videos/' + req.file.originalname;

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { res.render('media/videos'); });
  src.on('error', function(err) { res.render('error'); });
});

module.exports = router;