
const express = require("express");
const users = require("../models/users");
const { validateSignUpData, loginValidator } = require("../utilis/validator");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");

authRouter.post("/signup", async (req, res) => {
  try {
    const { data } = validateSignUpData(req.body);

    const hashedpassword = await bcrypt.hash(data.password, 10);

    const user = new users({
      ...data,
      password: hashedpassword,
    });
    await user.save();
    res.status(200).send({ success: true, message: "User Added Successfully" });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new Error("Email and Password is missing");
    }
    const {data} = loginValidator(req.body);
    const user = await users.findOne({ email : data.email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }
   const isPasswordMatch = await user.validatePassword(data.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid Credentials");
    }
    const token = await user.getToken();
   res.cookie('token', token, {httpOnly: true, secure: true, expiresIn:'1d'});
    res
      .status(200)
      .send({ success: true, message: "User Login Successfully", data:{userId: user._id, name: user.name} });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ success: true, message: "User logged out successfully" });
});
    

module.exports = authRouter;