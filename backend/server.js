const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const client = require("./config/db");
const userRouter = require("./router/userRouter");
const verifyToken = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static assets (optional for Tailwind if custom CSS added)
app.use(express.static(path.join(__dirname, "public")));

// Mount user routes (POST: login, signup, update, delete)
app.use("/user", userRouter);

// GET: Login page
app.get("/", (req, res) => {
  res.render("login", { error: null });
});

// GET: Dashboard (protected)
app.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users ORDER BY id ASC");
    res.render("dashboard", {
      user: req.user,
      users: result.rows
    });
  } catch (err) {
    res.status(500).send("Failed to load dashboard");
  }
});

app.get("/add-user-form", verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).send("Access Denied");
  }
  res.render("addUser", { user: req.user });
});


// POST: Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
