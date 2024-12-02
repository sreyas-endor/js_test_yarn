const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const validateUser = require('../config/validateUser');

const saltRounds = 10;

router.post('/login', passport.authenticate('local', {
  failWithError: true
}), function(req, res){
  return res.json({message: 'done'});
}, function(err, req, res, next){
   return res.status(200).send({message: req.authError});
});

router.get('/login/failed', function(req, res){
  console.log(req.body.authError);
  res.json({message: req.body.authError});
});

router.post('/signup', async function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  if(!(await validateUser(username))){
    res.json({message: 'Username already taken'});
  }else{
    try{
      var hash = await bcrypt.hash(password, saltRounds);
      var user = new User({
        username: username,
        password: hash
      });
      await user.save();
      res.json({message: 'done'});
    } catch{
      res.json({message: 'Some error detected, please try again later'});
    }
  }
});

router.get('/logout', function(req, res){
  req.logout();
  res.json({message: 'done'});
});

router.get('/isAuthenticated', function(req, res){
  
  if(req.user){
    res.json({isAuthenticated: true});
  } else{
    res.json({isAuthenticated: false});
  }
});

module.exports = router;
