const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Cart Item schema
const cartItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Define the Wishlist Item schema
const wishlistItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
});

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cart: [cartItemSchema],
  wishlist: [wishlistItemSchema],
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
