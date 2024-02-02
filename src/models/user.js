const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/server-config')

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "others"] },
    email: { type: String, required: true },
    password: { type: String, required: true },
    barCouncilId: { type: String, required: true },
    barCouncilNo: { type: Number, required: true },
    barCouncilYear: { type: Number, required: true },
    state: { type: String, required: true }, // add states enum ?
    city: { type: String, required: true }, // add city enum ?
    pincode: { type: Number, required: true },
    id_url: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();

    const encryptedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(+SALT_ROUNDS));
    user.password = encryptedPassword;
    next();
})

const User = new mongoose.model('User', userSchema);

module.exports = User;