var jwt = require('jsonwebtoken');

async function checkToken(req, res, next) {
try {
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        throw new Error("Khong có token")
    }
    else {
        jwt.verify(token,'nguyen',(error,decode)=>{
            if(error) {
                throw new Error("Token lỗi")
            }else {
                req.user = decode
               next()
                
            }
        })
    }
} catch (error) {
    console.log("Lỗi token: ", error);
    return res.status(500).json({status:false, message:error})
}
}


module.exports = checkToken