const joi = require("joi");

const userSignupSchema =joi.object({
    username:joi.string().min(3).max(100).required(),
    email:joi.string().email(),
    password:joi.string().min(5).max(50),
    created_by:joi.string(),
    updated_by:joi.string(),
    role:joi.string()
})
const userSigninSchema =joi.object({
    email:joi.string().email(),
    password:joi.string().min(5).max(50),
})
const userRoleUpdate =joi.object({
    updated_by:joi.string(),
    role:joi.string()
})

module.exports={userSigninSchema,userSignupSchema,userRoleUpdate};