const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const {refresh_token} = req.body;

    if (!refresh_token) return res.status(401).json({"message": "Refresh token not found"});
    const refreshToken = refresh_token;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.status(403).json({"message": "user not found with this refresh token, login "}); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.status(403).json({"message":"username does not match with token decoded username"});
           
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "id": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '100s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }