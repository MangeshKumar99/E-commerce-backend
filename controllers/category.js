const Category = require("../models/category");
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = category;
    next();
  });
};
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category not saved to DB!",
      });
    }
    return res.status(200).json(category);
  });
};
exports.getCategory = (req, res) => {
  res.json(req.category);
};
exports.getAllCategories = (req, res) => {
  Category.find({}, (err, category) => {
    if (err || !category) {
      return res.status(404).json({
        error: "No categories found!",
      });
    }
    return res.status(200).json(category);
  });
};
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Category update failed",
      });
    }
    return res.status(200).json(updatedCategory);
  });
};
exports.removeCategory = (req, res) => {
  Category.findByIdAndRemove(req.category._id, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    return res.status(200).json({
      message: `Category with ${req.category._id} successfully deleted`,
    });
  });
};
