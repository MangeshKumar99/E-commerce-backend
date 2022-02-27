const express = require("express");
const router = express.Router();
const { getUserById,pushOrdersInPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getProductById, getProduct, createProduct, getPhoto, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategories, updateStock, } = require("../controllers/product");
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus } = require("../controllers/order");


router.param("userId", getUserById);
router.param("orderId", getOrderById);
router.post("/order/create/:userId",isSignedIn, isAuthenticated, pushOrdersInPurchaseList, updateStock, createOrder);
router.get("/order/all/:userId",isSignedIn, isAuthenticated, isAdmin, getAllOrders);
router.get("/order/status/:userId",isSignedIn, isAuthenticated, isAdmin,getOrderStatus);
router.put("/order/:orderId/status/:userId",isSignedIn, isAuthenticated, isAdmin,updateOrderStatus);

module.exports=router;