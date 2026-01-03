
const express = require('express');
const ConnectionReq = require('../models/connection-req');
const userAuth = require('../middlewares/auth');
const { connect } = require('mongoose');

const connectionRequestRouter = express.Router();

connectionRequestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
 
    try{
         const fromUserId = req.user._id;
         const toUserId = req.params.toUserId;
         const status = req.params.status

         const allowedStatus = ['ignored', 'interested']
            if(!allowedStatus.includes(status)){ 
                return res.status(400).json({error: 'Invalid status value'});
            }
        const existingRequest = await ConnectionReq.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if(existingRequest){
            return res.status(400).json({error: 'Connection request already exists between these users'});
        }
        const newRequest = new ConnectionReq({
            fromUserId,
            toUserId,
            status
        });
        await newRequest.save();
        res.status(201).json({message: 'Connection request sent successfully', request: newRequest});

    }catch(err){
        res.status(500).json({error: err.message});
    }
});

connectionRequestRouter.post('/respond/:status/:requestId', userAuth, async (req, res) => {

  try{

    const {status, requestId} = req.params;

    const allowedStatus = ['accepted', 'rejected']

    if(!allowedStatus.includes(status)){ 
        return res.status(400).json({error: 'Invalid status value'});
    }

  const connectionRequest = await ConnectionReq.findOne({_id: requestId, toUserId: req.user._id, status: 'interested'}).populate('fromUserId', 'name ');

  if(!connectionRequest){
    return res.status(404).json({error: 'No pending connection request found'});
  }

  connectionRequest.status = status;
  await connectionRequest.save();
  res.status(200).json({message: 'Connection request '+ status +' successfully', request: connectionRequest});

}catch(err){
    res.status(500).json({error: err.message});
}
})

connectionRequestRouter.get("/received", userAuth, async (req, res) => {
  try{
    const user = req.user;

    const requests = await ConnectionReq.find({toUserId: user._id, status: 'interested'}).populate('fromUserId', 'name profile skills');

    res.status(200).json({success: true, requests});

  }catch(err){
    res.status(500).json({error: err.message});
  }
});



module.exports = connectionRequestRouter;