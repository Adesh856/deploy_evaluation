const jwt = require("jsonwebtoken")
const {client} = require("../redis")
const UserModel = require("../models/user.model")
require("dotenv").config()

const auth = async (req,res,next)=>{
    const token = req.cookies.NormalToken
    const IsBlacklisted = await client.get("NormalBlacklisted")

    if(IsBlacklisted){
        res.send("Please login first")
    }
    if(token){
        jwt.verify(token,process.env.Normal_token_secret_key,async(err,decoded)=>{
            if(decoded){
                const {userID} = decoded
                req.body.userID=userID
                next()
            }else{
                res.status(400).send("please login")
            }
          
        })

    }else{
        res.status(400).send("please login")
    }
}


module.exports = {auth}