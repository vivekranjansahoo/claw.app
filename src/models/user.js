const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {SALT_ROUNDS} = require('../config/server-config') 

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required : true,
        unique: true,
    },
    username: {
        type: String,
        required : true,
        unique: true,
    },
    password : {
        type: String,
        required : true,
    },
    role: {
        type: String,
        enum: ['ca', 'lawyer'],
        required : false,
    },
    designation: {
        type: String,
        required : false,
    },
    consulting_rate: {
        type: Number,
        required: false,
    },
    total_cases_solved: {
        type: Number,
        reqred: false,
    },
    badges: {
        type: String,
        enum: ['premium', 'verified']
    },
    profilePic: {
        type: String,
        required: false,
    },
    backgroundPic: {
        type: String,
        required: false,
    },
    phone: {
        type: Number,
        required: false,
    },
},{timestamps: true});

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))return next();

    const encryptedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(+SALT_ROUNDS));
    user.password = encryptedPassword;
    next();
})

const User = new mongoose.model('User', userSchema);

module.exports = User;