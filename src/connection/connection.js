const mongoose = require("mongoose");

const connect_string =
  "mongodb+srv://psynytlearning:Naughty12345@cluster0.8gltpho.mongodb.net/user_data";

// funciton to connect to database
const dbConnect = async () => {
  try {
    await mongoose.connect(connect_string);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

module.exports = dbConnect;
