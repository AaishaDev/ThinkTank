const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({"message": "Unauthorized"});
    const token = authHeader.split(' ')[1];
   
   await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err){
                return res.status(403).json({"message": "Invalid token"});
            } //invalid token
            req.body.username = decoded.UserInfo.username;
            req.body.user = decoded.UserInfo.id;
            next()
        },
       
    );
 
   
    
}
// 
module.exports = verifyJWT