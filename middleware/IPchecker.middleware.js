const expression = /^(\d{1-3}\.){3}\d{1,3}$/

const Ipchecker = async (req,res,next) =>{
  req.body.IP=req.ip
  const check = expression.test(req.body.IP)
 
  if(check){
    next()
  } 
   res.send("Ip format is not correct")

}

module.exports = Ipchecker
