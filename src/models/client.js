const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    state: { type: String },
    city: { type: String },
    profilePicture: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    registered: { type: Boolean, default: false },
}, { timestamps: true });

const Client = new mongoose.model('Client', clientSchema);

module.exports = Client;