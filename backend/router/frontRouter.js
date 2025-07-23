const express = require("express");

const userRouter = express.Router();
const {loginPage ,dashboardPage,addUserForm,logout} = require("../controller/userController");
const verifyToken = require("../middleware/authMiddleware");

userRouter.get("/",loginPage);
userRouter.get("/dashboard",verifyToken,dashboardPage);
userRouter.get("/add-user-form",verifyToken,addUserForm);
userRouter.post("/logout",logout);

module.exports = userRouter;