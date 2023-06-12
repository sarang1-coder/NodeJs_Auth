const User = require('../models/User');

module.exports.profile = function(req, res) {
  return res.render('profile');
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

  if (password != confirm_password) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('back');
  }

  try {

    const user = await User.findOne({ email: email });

    if (!user) 
    {
      const newUser = await User.create(req.body);
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

module.exports.createSession = function(req, res) {
  // TODO: Implement createSession function
};
