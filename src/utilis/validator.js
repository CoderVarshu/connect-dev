const validator = require('validator');


const validateSignUpData=(data) => {
    
    const {name, age, gender, email, password, phone} = data
    if(!name || validator.isEmpty(name.trim())){
       throw new Error ('Name is required')
    }
    if(!age || !validator.isInt(age.toString(), {min: 0})){
        throw new Error ('Valid age is required')
    }
    if(!gender || !validator.isIn(gender, ['male', 'female', 'other'])){
        throw new Error ('Valid gender is required')
    }
    if(!email || !validator.isEmail(email)){
        throw new Error ('Valid email is required')
    }
    if(!password || !validator.isStrongPassword(password)){
        throw new Error ('Password must be strong')
    }
    if(!phone || !validator.isMobilePhone(phone)){
        throw new Error ('Valid phone number is required')
    }
   
    return {data};
}

const loginValidator = (data) => {
    const {email, password} = data
    if(!email || !validator.isEmail(email)){
        throw new Error ('Valid email is required')
    }
    if(!password || !validator.isStrongPassword(password)){
        throw new Error ('Password must be strong')
    }
    return {data};
}

const validateProfileUpdate = (data) => {
   const isAllowedUpdates = ['name', 'age','phone', 'gender', 'profile', 'discription', 'skills'];
   const isAllowed = Object.keys(data).every((field) => isAllowedUpdates.includes(field));
   return isAllowed;
  
}

module.exports = {validateSignUpData, loginValidator, validateProfileUpdate};