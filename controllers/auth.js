const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (errors.errors.length != 0) {
    return res.status(422).json({
      error: errors.errors[0].msg,
    });
  }
  
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "User not saved to DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};
exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (errors.errors.length != 0) {
    return res.status(422).json({
      error: errors.errors[0].msg,
    });
  }
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email does not exists",
      });
    }
    if (user.authenticate(password) == false) {
      return res.status(400).json({
        error: "Email and password does not match",
      });
    }
    //Create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    //Send response to front-end
    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfull..",
  });
};

//Protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});
// Custom middlewares
exports.isAuthenticated = (req, res, next) => {
  //Through frontend we are going to set up a property inside user called profile.
  //This property is only going to set if the user is logged in
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an ADMIN",
    });
  }
  next();
};
