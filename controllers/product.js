const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found in DB",
      });
    }
    req.product = product;
    next();
  });
};
exports.getProduct = (req, res) => {
  req.product.photo = undefined; //Optimization for binary data
  return res.json(req.product);
};
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }
    //destructure the fields

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        message: "Please include all the fields..",
      });
    }
    let product = new Product(fields);
    //Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      // Include our file into product
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // Save to DB

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not saved to DB",
        });
      }
      return res.status(200).json(product);
    });
  });
};
//Middleware for optimization of binary data
exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }
    //destructure the fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        message: "Please include all the fields..",
      });
    }
    let product = req.product;
    product = _.extend(product, fields);

    //Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      // Include our file into product
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // Save to DB

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not saved to DB",
        });
      }
      return res.status(200).json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  Product.findByIdAndRemove(req.product._id, (err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    return res.status(200).json({
      message: `Product with ${req.product._id} successfully deleted`,
    });
  });
};
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "Product not found in DB",
        });
      }
      return res.status(200).json(products);
    });
};
// exports.getAllProducts = (req, res) => {
//   Product.find({}, (err, products) => {
//     if (err || !products) {
//       return res.status(404).json({
//         error: "No products found!",
//       });
//     }
//     return res.status(200).json(products);
//   });
// };
exports.updateStock = (req, res, next) => {
  let myOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperation, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "BULK operation failed!",
      });
    }
    next();
  });
};
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "Categories not found!",
      });
    }
    return res.status(200).json(categories);
  });
};
