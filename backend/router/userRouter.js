const express= require("express");

const userRouter = express.Router();

const validateRequest=require("../middleware/validate");
const {userSignupSchema,userSigninSchema,userRoleUpdate}=require("../validator/userValidator")
const {addUser,loginUser,updateUser,deleteUser} = require("../controller/userController");
const verifyToken=require("../middleware/authMiddleware");

userRouter.post("/add-user",validateRequest(userSignupSchema),addUser);
userRouter.post("/login-user",validateRequest(userSigninSchema),loginUser);
userRouter.put("/update-user/:id",verifyToken,validateRequest(userRoleUpdate),updateUser);
userRouter.put("/delete-user/:id",verifyToken,deleteUser);

module.exports=userRouter;