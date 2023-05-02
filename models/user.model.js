const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    email : {type:String,unique:true,required:true},
    password : {type:String,required:true},
    IP : {type:Number,required:true},
    userID:String
})

const UserModel = mongoose.model("Userscollection",UserSchema)

module.exports = {UserModel}