const mongoose = require('mongoose')

async function connectDB () {
    await mongoose.connect('mongodb+srv://varsha:iwmqKkZGlZtNP4C2@cluster0.agjmdhj.mongodb.net/devtinder')
}


module.exports = connectDB