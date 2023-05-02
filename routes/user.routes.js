const {
    registreation,login,logout,newToken,GetIPINFO
} = require('../controller/user.controller')
const {auth} =require("../middleware/auth.middleware")
const UserRouter = require("express").Router()
const Ipchecker = require("../middleware/IPchecker.middleware")

UserRouter.post("/register",Ipchecker,registreation)
UserRouter.post("/login",login)
UserRouter.get("/logout",logout)
UserRouter.get("/newtoken",newToken)
UserRouter.get("/GetIpInfo",auth,GetIPINFO)
module.exports = UserRouter