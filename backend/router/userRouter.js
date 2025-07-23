const express = require("express");

const userRouter = express.Router();

const validateRequest = require("../middleware/validate");
const { userSignupSchema, userSigninSchema, userRoleUpdate } = require("../validator/userValidator")
const { addUser, loginUser, updateUser, deleteUser,renderUser,loginPage ,dashboardPage,addUserForm,logout} = require("../controller/userController");
const verifyToken = require("../middleware/authMiddleware");

userRouter.post("/add-user", validateRequest(userSignupSchema), addUser);
userRouter.post("/login-user", validateRequest(userSigninSchema), loginUser);
userRouter.post("/update-user/:id", verifyToken, validateRequest(userRoleUpdate), updateUser);
userRouter.post("/delete-user/:id", verifyToken, deleteUser);
userRouter.get("/update-user/:id", verifyToken, renderUser);

module.exports = userRouter;