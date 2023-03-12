const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  } //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "6d" }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // Send refresh and access token to user
    res.json({ access_token: accessToken, refresh_token: refreshToken });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = handleLogin;
