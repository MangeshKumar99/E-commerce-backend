const User = require("../models/user");
const Order = require("../models/order");
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found in DB",
      });
    }
    req.profile = user;
    next();
  });
};
exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};
exports.getAllUsers = (req, res) => {
  // You can follow either of the below methods for querying
  // Every model method that accepts query conditions can be executed by means of a callback or the exec method.
  User.find({}, (err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: "Users not found in DB",
      });
    }
    return res.status(200).json(user);
  });

  // User.find({}).exec((err,user)=>{
  //   if (err || !user) {
  //     return res.status(404).json({
  //       error: "Users not found in DB",
  //     });
  //   }
  //   return res.status(200).json(user);
  // })
  //};

  // exports.getAllUsers=async(req,res)=>{
  //   const user=await User.find({});
  //   try {
  //     res.status(200).json(user);
  //   } catch (err) {
  //     res.status(404).json({
  //       error:"Users not found in DB"
  //     })
  //   }
};
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.profile._id,
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.status(200).json(user);
    }
  );
};
// exports.updateUser = async (req, res) => {
//   const user = await User.findOne({ _id: req.profile._id });
//   try {
//     user.lastname = req.body.lastname;
//     const updatedUser = await user.save();
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({
//       error: "You are not authorized to update this user",
//     });
//   }
// };
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    //Anytime when you are referencing
    //something in a different collection
    //you need to use populate()

    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order for this account",
        });
      }
      return res.status(400).json(order);
    });
};
exports.pushOrdersInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  //now store this in db
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchase) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to save purchase list to DB",
        });
      }
      next();
    }
  );
};
