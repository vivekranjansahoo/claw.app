const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    email: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    collegeName: { type: String, trim: true },
    profilePicture: { type: String, trim: true },
    phoneNumber: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    registered: { type: Boolean, default: false },
    ambassador: { type: Boolean, default: false },
}, { timestamps: true });

const Client = new mongoose.model('Client', clientSchema);

module.exports = Client;