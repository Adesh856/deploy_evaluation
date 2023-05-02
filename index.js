const connection = require("./db")
require("dotenv").config()
const express = require("express")
const requestIp = require("request-ip")
const UserRouter = require("./routes/user.routes")
const winston = require("winston")
require("winston-mongodb")
const cookieparser= require("cookie-parser")
const expresWinston = require("express-winston")


const app = express()
app.use(express.json())
app.use(cookieparser())

app.use(expresWinston.logger({
    transports:[
     new winston.transports.MongoDB({
        db:process.env.ERRormongourl,
        level:"error",
        json:true
     })
   
    ],
    format:winston.format.prettyPrint()
}))

app.use("/user",UserRouter)





app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("MongoDB is connected with server")
    } catch (error) {
        console.log("MongoDB is not connected with server")
    }
    console.log(`Listening on port : ${process.env.port}`)
})