const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});
const ProductCart = mongoose.model("ProductCart", productCartSchema);

const ordersSchema = new mongoose.Schema(
  {
    products: [productCartSchema],
    transaction_id: {},
    amount: { type: Number },
    status: {
      type: String,
      default: "Received",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"],
    },
    address: String,
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", ordersSchema);
module.exports = { Order, ProductCart };
