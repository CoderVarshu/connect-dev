const mongoose = require('mongoose')
 
const mongoURI = process.env.MONGODB_URI || ''

async function connectDB () {
    await mongoose.connect(mongoURI)
}


module.exports = connectDB