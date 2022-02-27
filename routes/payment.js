const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {getToken, processTransaction} =require("../controllers/payment")

router.param("userId", getUserById);
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);
router.post("/payment/braintree/:userId", isSignedIn, isAuthenticated, processTransaction);

module.exports = router;
