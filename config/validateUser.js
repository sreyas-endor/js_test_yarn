const User = require('../models/user');

async function validateUser(user){
  var count = await User.countDocuments({username: user});
  if(count>0 || user.length === 0){
    return false;
  }else{
    return true;
  }
}

module.exports = validateUser;