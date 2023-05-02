const { json } = require("body-parser")
const {UserModel} = require("../models/user.model")
require("dotenv").config()
const {client} = require("../redis")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { error } = require("winston")
const { cli } = require("winston/lib/winston/config")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const registreation = async (req,res) =>{
    try {
        const {password,email,ip} = req.body
       
        const hashedpassword = bcrypt.hashSync(password,5);
        const newUser = new UserModel({email,password,ip})
        await newUser.save() 
        res.status(200).send({"msg":"User has been registerd"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
}

const login = async (req,res) =>{
    try {
        const {email,password} = req.body
        const user = await UserModel.findOne({email})
        const checkpassword = bcrypt.compareSync(password,user.password) 
        if(!user){
            res.status(400).send({"msg":"Unauthorised"})
        }
        if(!checkpassword){
            res.status(400).send({"msg":"Unauthorised"})
        }
        const NormalToken = jwt.sign(
            {userid:user._id,Ip:user.Ip},
            process.env.Normal_token_secret_key,{expiresIn:"1hr"}
            )
        const RefreshToken = jwt.sign(
            {userid:user._id,Ip:user.Ip},
            process.env.Refersh_token_secret_key,{expiresIn:"2hr"}
            )
            res.cookie("NormalToken"
            ,{maxAge:1000*60*5})
            res.cookie("NormalToken",NormalToken,{maxAge:1000*60*5})
            res.cookie("RefreshToken",RefreshToken,{maxAge:1000*60*5})
            res.status(200).send({"msg":"Login Successfully"})
    } catch (error) {
        res.status(400).send({"msg":error.message}) 
    }
}

const logout = async (req,res) =>{
    try {
        const {NormalToken,RefreshToken} = req.cookies
        if(!NormalToken||!RefreshToken){
            res.status(400).send("Unauthorised")
        }
        client.mset("NormalBlacklisted",NormalToken,"RefreshBlacklisted",RefreshToken,"EX",60*60)
        res.clearCookie("NormalToken")
        res.clearCookie("RefreshToken")
        res.status(200).send({"msg":"Logout Successfully"})
    } catch (error) {
        res.status(400).send({"msg":error.message}) 
    }
}

const newToken = async (req,res) =>{
    try {
        const {RefreshToken} = req.cookies
        if(!RefreshToken){
            res.status(400).send({"msg":"please login"})
        }
        const isvalid = jwt.verify(RefreshToken,process.env.Normal_token_secret_key)
        if(!isvalid){
            res.status(400).send({"msg":"please login"})
        }
        const newtoken = jwt.sign(
            {userid:user._id,Ip:user.Ip},
            process.env.Normal_token_secret_key,{expiresIn:"1hr"}
            )
            res.cookie("NormalToken",newtoken)
            res.status(200).send({msg:"token generated" ,newtoken})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
}
const GetIPINFO = async (req,res) =>{
  try {
    const User = await UserModel.findOne({userID:req.body.userID})
    const {ip} = User.IP
    let arr=[]
    fetch(`https://ipapi.co/${ip}/{format}/`).then((res)=>res.json).then((data)=>{
     arr=data
    }).catch((error)=>{
        res.send({"msg":error.message})
    })
    client.set("location",arr.city)
    let cityredis = await client.get("location")
    if(cityredis){
        res.status(200).send({city:cityredis})
    }else{
        res.status(200).send({city:arr.city})
    }
    
  } catch (error) {
    res.status(400).send({"msg":error.message})
  }
}

module.exports = {
    registreation,login,logout,newToken,GetIPINFO
}