var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/', ensureAuthenticated, function(req, res) {
  res.render('dashboard', { title: 'Dashboard' , layout: 'dashboard_layout'});
});

function ensureAuthenticated(req,res,next) {
   if(req.isAuthenticated()) {
      return next();
   } else {
      console.log("You are not logged in");
      req.flash('error', 'You are not logged in');
      res.redirect('/');
   }
}

module.exports = router;