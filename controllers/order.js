const order = require("../models/order");
const { Order, ProductCart } = require("../models/order");
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price") //.populate("Which field you want to populate","Information you want to grab")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "Order not found in DB",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot save order to DB",
      });
    }
    return res.status(200).json(order);
  });
};
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          error: "Cannot fetch orders",
        });
      }
      return res.status(200).json(orders);
    });
};
exports.updateOrderStatus = (req, res) => {
  const orderToUpdate = req.order;
  orderToUpdate.status = req.body.status;
  orderToUpdate.save((err, updatedOrder) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot update Order Status",
      });
    }
    return res.status(200).json({
      messaage: `Order Status of ${updatedOrder._id} succesfully updated`,
    });
  });
};
exports.getOrderStatus = (req, res) => {
  return res.json(Order.schema.path("status").enumValues);
};
