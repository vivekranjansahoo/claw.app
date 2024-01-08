const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {SALT_ROUNDS} = require('../config/server-config') 

const clientSchema = new mongoose.Schema({
    email: {
        type : String,
        required : true,
        unique: true,
    },
    username: {
        type: String,
        required : true,
        unique : true,
    },
    phone: {
        type: Number,
        required : false,
    },
    password : {
        type: String,
        required : true,
    },
    posts: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            }
        ]
    }
},{timestamps: true});

clientSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))return next();

    const encryptedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(+SALT_ROUNDS));
    user.password = encryptedPassword;
    next();
})

const Client = new mongoose.model('Client', clientSchema);

module.exports = Client;