const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getProductById, getProduct, createProduct, getPhoto, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product");

router.param("userId", getUserById);
router.param("productId", getProductById);
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getPhoto);
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin ,createProduct);
router.put("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin, updateProduct);
router.delete("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin, deleteProduct);
router.get("/products",getAllProducts);
router.get("/products/categories",getAllUniqueCategories);


module.exports=router;