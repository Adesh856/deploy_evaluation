const Redis = require("ioredis")

const  configuration = {
host:"redis-13303.c263.us-east-1-2.ec2.cloud.redislabs.com",
port:13303,
username:"default",
password:process.env.redis_pass
}

const client = new Redis(configuration)

module.exports = {client}