
const express = require('express');
const ConnectionReq = require('../models/connection-req');
const userAuth = require('../middlewares/auth');

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
        res.status(500).json({error: 'Internal Server Error'});
    }
});


module.exports = connectionRequestRouter;