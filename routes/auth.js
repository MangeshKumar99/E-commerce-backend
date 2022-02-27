const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("must be at least 3 chars long"),
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("email is required"),
    check("password").isLength({ min: 1 }).withMessage("password is required"),
  ],
  signin
);
router.get("/signout", signout);
router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
  //   "user": {
  //     PROFILE OBJECT
  //     "_id": "61b4377aba949937e8acb6cf",
  //     "name": "Sonal",
  //     "email": "sonal@gmail.com",
  //     "role": 0
  // }
  // {
  //    AUTH OBJECT
  //   "_id": "61b4377aba949937e8acb6cf",
  //   "iat": 1639286244
  // }
});
module.exports = router;
