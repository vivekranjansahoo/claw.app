const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/server-config')

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    email: { type: String },
    barCouncilId: { type: String },
    barCouncilNo: { type: Number },
    barCouncilYear: { type: Number },
    state: { type: String }, // add states enum ?
    city: { type: String }, // add city enum ?
    pincode: { type: Number },
    id_url: { type: String },
    phoneNumber: { type: String, required: true },
    verified: { type: Boolean, default: false },
    registered: { type: Boolean, default: false }
}, { timestamps: true });

// userSchema.pre('save', function (next) {
//     let user = this;
//     if (!user.isModified('password')) return next();

//     const encryptedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(+SALT_ROUNDS));
//     user.password = encryptedPassword;
//     next();
// })

const User = new mongoose.model('User', userSchema);

module.exports = User;