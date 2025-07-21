const express = require("express");
const cors = require("cors");
const client = require("./config/db");
const userRouter = require("./router/userRouter")

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user",userRouter);


app.listen(3000,()=>{
    console.log("Server running on port 3000");
})