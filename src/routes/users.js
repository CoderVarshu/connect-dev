const express = require("express");
const userAuth = require("../middlewares/auth");
const users = require("../models/users");
const ConnectionReq = require("../models/connection-req");
const userRouter = express.Router();

userRouter.get("/", userAuth, async (req, res) => {
  try {
    const data = await users.find();
    return res
      .status(200)
      .json({ success: true, message: "Users Data fecthed ", data });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Something went wrong " + err.message });
  }
});

userRouter.patch("/:userId", userAuth, async (req, res) => {
  const userId = req.params.userId;
  const user = req.body;
  try {
    const NOT_ALLOWED_UPDATES = ["email", "phone"];
    const isForbiddenUpdate = Object.keys(user).some((k) =>
      NOT_ALLOWED_UPDATES.includes(k)
    );
    if (isForbiddenUpdate) {
     return res.status(400).json({
    success: false,
    message: "Email or phone cannot be modified"
  });
}
    const data = await users.findByIdAndUpdate({ _id: userId }, user, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .send({ success: true, message: "User Updated Successfully", data });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send({ success: false, message: err.message });
  }
});

userRouter.get("/connections", userAuth, async(req,res)=>{
    try{

        const user = req.user;

        const connections = await ConnectionReq.find({
            $or: [
                {fromUserId: user._id, status: 'accepted'},
                {toUserId: user._id, status: 'accepted'}
            ]
        }).populate('fromUserId toUserId', 'name profile skills').select(' -createdAt -updatedAt -__v');

        const validateConnections = connections.map(conn => {
            if(conn.fromUserId._id.equals(user._id)){
                return conn.toUserId
            } else {
                return conn.fromUserId
            }
        });

        res.status(200).json({success: true, validateConnections});

    } catch(err){
        res.status(500).json({error: err.message});
    }
})


module.exports = userRouter;