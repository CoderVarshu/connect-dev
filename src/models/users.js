const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.SECRET || "mysecretkey";

const UserSchema = new mongoose.Schema({
    name: {
         type: String,
         required: true
         },
    age: {
        type : Number
    },
    gender : {
        type: String,
        enum: ['male', 'female','other']
    },
    email : {
        type : String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error ("Invalid Email Address"+ value)
            }
        }
    }, 
    password : {
        type: String,
        required: true
    },
    phone: {
        type : String,
        required: true,
        unique: true,
        match: [/^\d{10}$/,'Invalid Number']
    }, 
    profile:{
        type: String,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error('Invalid Photo URL'+value)
            }
        }
    },
    discription: {
        type: String
    },
    skills: {
        type: [String],
        validate:{
            validator : function (arr) {
                return arr.length <= 10
            }, 
            message: "You can add up to 10 skills"
        }
    },

}, {
    timestamps: true
})

UserSchema.methods.getToken = function() {
    const user = this;
    const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1d'});
    return token;
} 

UserSchema.methods.validatePassword = async function(password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

module.exports = mongoose.model("User", UserSchema)