const users = require("../models/users");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET || "mysecretkey";

const userAuth= async(req, res, next) => {
  const cookies = req.cookies;
  const token = cookies.token;
  if (!token) {
    return res.status(401).send({ success: false, message: "Unauthorized, Token not valid!!" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await users.findById(decoded.userId);
    if (!user) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ success: false, message: "Invalid Token" });
  }
}

module.exports = userAuth;