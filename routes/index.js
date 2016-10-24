var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Please Login' });
});

router.get('/register', function(req, res,next) {
  res.render('register', { title: 'Create an Account' });
});


router.post('/register', function(req, res, next) {
   var name = req.body.name;
   var username = req.body.username;
   var email = req.body.email;
   var password = req.body.password;
   var password2 = req.body.password2;

   // Validation
   req.checkBody('name', 'Name is required').notEmpty();
   req.checkBody('email', 'Email is required').notEmpty();
   req.checkBody('email', 'Email is not valid').isEmail();
   req.checkBody('username', 'Username is required').notEmpty();
   req.checkBody('password', 'Password is required').notEmpty();
   req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

   var errors = req.validationErrors();
   if(errors) {
   	 res.render('register' ,{
   	 	errors:errors
   	 });
   } else {
        var newUser = new User({
           name: name,
           username: username,
           email: email,
           password: password
        });

        User.createUser(newUser, function(err, user){
            if (err) {
            	res.send(err);
            }
            else {
            	req.flash('success', 'You are now registered');
                res.redirect('/dashboard');
            }
        });
   }
});

passport.use('local', new LocalStrategy(
  function(username, password, done) {

    User.getUserByUsername(username , function(err, user) {
        if(err) {
        	res.send(err)
        	console.log('Error: '+err);
        } 

        if(!user) {
        	console.log('Unknown User');
        	return done(null, false, {message: 'Unknown User'});
        	
        }

        User.comparePassword(password, user.password, function(err, isMatch){
        	if(err) {
        		 res.send(err)
        		 console.log('Unknown User');
        	}

        	if (isMatch) {
        		return done(null, user);
        	} else {
        		console.log('Invalid password');
        		return done(null, false, {message: 'Invalid password'});
        		
        	}
        })
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/'}),
  function(req, res) {
    // res.redirect('/dashboard');
  });

router.get('/logout', function(req,res){
   req.logout();
   req.flash('success', 'You are now logged in ');
   res.redirect('/');
});

module.exports = router;
