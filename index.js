const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dbConnect = require("./connection/connection");
const User = require("./models/user");

const app = express();

app.use(express.json()); // else you won't be able to decode your req body
app.use(
  cors({
    origin: ["http://localhost:5173", "https://psynytwebshop.netlify.app"],
  })
);

const jwtPassword = "12345678";

const generateToken = (user) => {
  const payload = {
    username: user.username,
    password: user.password,
  };
  return jwt.sign(payload, jwtPassword);
};

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Access denied");
  }

  try {
    const decoded = jwt.verify(token, "12345678");
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

app.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    await dbConnect();
    const user = await User.findOne({ username: username });

    console.log("User is: ", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    console.log("user exists:");
    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    console.log("user exists:", isPasswordValid);
    const token = generateToken({ username, password });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        cart: user.cart,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  console.log("New user data is: ", username, password, name);
  try {
    await dbConnect();
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password: ", hashedPassword);

    const user = new User({
      name,
      username,
      password: hashedPassword,
    });

    await user.save();
    console.log("user data is: ", user);

    res.json({
      msg: "User created successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/wishlist/add", async (req, res) => {
  const { productId, userId } = req.body;
  // 66581f6db69c5fca75050709
  console.log("Req body is for adding to wish list is: ", productId, userId);
  try {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const userWishlistProduct = user.wishlist.find(
      (item) => item.productId === productId
    );

    if (userWishlistProduct) {
      console.log("user exist and user is: ", userWishlistProduct);
      return res.status(200).json("already exists");
    }

    if (!userWishlistProduct) {
      user.wishlist.push({ productId });
      await user.save();
      console.log("new user wishlist: ", user.wishlist);
    }

    res.status(200).json({
      message: "done boiiss",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        cart: user.cart,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/wishlist/remove", async (req, res) => {
  const { userId, productId } = req.body;
  console.log(
    "removing from database wishlist for productid: ",
    productId,
    userId
  );
  try {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.wishlist.length === 0) {
      return res.status(200).json({ msg: "No items in wishlist" });
    }

    // Remove the product from the wishlist array
    user.wishlist = user.wishlist.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    // Save the updated user document
    await user.save();
    console.log("New user wishlist: ", user.wishlist);

    res.json({
      msg: "Item removed from wishlist",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        cart: user.cart,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/userinfo", async (req, res) => {
  const token = req.header("Authorization");
  try {
    await dbConnect();
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    const user = await User.findOne({ username });
    console.log("user details are: ", user, username, decoded);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        cart: user.cart,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000);
