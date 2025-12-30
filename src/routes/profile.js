const express = require("express");
const userAuth = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/", userAuth, (req, res) => {
    try {
        const user = req.user
        return res.status(200).send({ success: true, message: "Profile fetched", data: user });
    } catch (err) {
        return res.status(401).send({ success: false, message: "Invalid Token" });
    }
})

profileRouter.patch("/", userAuth, async(req, res) => {
    try{
          if(!validateProfileUpdate(req.body)){
            return res.status(400).json({success: false, message: "Invalid updates!"});
          }
          const user = req.user;
            Object.keys(req.body).forEach((key) => {
                user[key] = req.body[key];
            });
            await user.save();
            res.status(200).send({ success: true, message: "Profile Updated Successfully", data: user });
    }catch(err) {
        res.status(500).send({ success: false, message: err.message });
    }
})

profileRouter.patch("/updatePassword", userAuth, async(req, res)=>{
  try{
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordMatch = await user.validatePassword(oldPassword);

    if (!isPasswordMatch) {
        return res.status(400).send({ success: false, message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({ success: true, message: "Password updated successfully" });
  }catch(err){
    res.status(500).send({ success: false, message: err.message });
  }
})

module.exports = profileRouter;