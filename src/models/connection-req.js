const mongoose = require('mongoose');

const ConnectionReqSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'pending','interested', 'accepted', 'rejected'],
            message: 'Status must be either pending, interested, accepted, or rejected',
        },
        default: 'pending',
    },
}, {
    timestamps: true
})

ConnectionReqSchema.pre('save', function(next) {
    if(this.fromUserId.equals(this.toUserId)){
       throw new Error('can not send request to yourself');
    }
    next();
})


const ConnectionReq = mongoose.model('ConnectionReq', ConnectionReqSchema);

module.exports = ConnectionReq;