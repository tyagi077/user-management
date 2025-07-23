const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const client = require("./config/db");
const userRouter = require("./router/userRouter");
const frontRouter = require("./router/frontRouter")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // to parse the json data in req.body
app.use(express.urlencoded({ extended: true }));  // to parse the form data 
app.use(cookieParser());  // to take the data from cookies

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Mount user routes (POST: login, signup, update, delete)
app.use("/user", userRouter);
app.use("/", frontRouter);


// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
