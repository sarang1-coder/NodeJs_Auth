const User = require('../models/User');
const bcrypt = require('bcrypt'); 



module.exports.profile = async function(req, res) {

  var id=req.cookies.user_id;

  try{

  var user = await User.findById(id);

if (user) { 
  var profile_user = {
    name: user.name,
    email: user.email,
    
  };

  return res.render('profile', {
    title: 'User Profile',
    profile_user: profile_user,
  });

  } 
  else {

  return res.redirect('/users/signin');
  
  }

  }catch(err){
    console.log(err);
    return res.redirect('back');
  }

};

module.exports.dashboard = function(req, res) {
  return res.render('dashboard');
};

module.exports.signin = function(req, res) {
  return res.render('signin');
};

module.exports.signup = function(req, res) {
  return res.render('signup');
};

module.exports.create = async function(req, res) {

  const { name, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('back');
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) 
    {

      const hashedPassword = await bcrypt.hash(password, 10);


      const newUser = await User.create({
          name: name,
          email: email,
          password: hashedPassword,
      });

      console.log(newUser.name);
      req.flash('success', 'Account created successfully');
      return res.redirect('/users/signin');
    } 
    else 
    {
      req.flash('error', 'Email already exists');
      return res.redirect('back');
    }
  } catch (error) 
  {
    console.error(error);
    req.flash('error', 'An error occurred');
    return res.redirect('back');
  }

};

module.exports.createSession = async function(req, res) {

  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  try {
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password); 

      if (passwordMatch) {
        res.cookie('user_id', user.id);
        return res.redirect('/users/profile');
      } else {
        req.flash('error', 'Invalid email or password');
        return res.redirect('back');
      }
    } else {
      req.flash('error', 'Invalid email or password');
      return res.redirect('back');
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred');
    return res.redirect('back');
  }

};


module.exports.updatePassword=(req,res)=>{

  return res.render('updatePassword');

}


module.exports.handleUpdatePassword = async function (req, res) {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.cookies.user_id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users/update-password');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      req.flash('error', 'Incorrect old password');
      return res.redirect('/users/update-password');
    }

    if (newPassword !== confirmNewPassword) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/users/update-password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    req.flash('success', 'Password updated successfully');
    return res.redirect('/users/profile');
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred');
    return res.redirect('/users/update-password');
  }
};


module.exports.signOut=function(req,res){

  res.redirect('/users/signin');

}