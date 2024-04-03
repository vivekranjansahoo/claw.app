const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client',
        required: true,
    },
    payment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
    },
    plan: {
        type: String,
        required: true,
        enum: ['PRO'],
        trim: true,
    },
    request: {
        type: Number,
        required: true,
    },
    session: {
        type: Number,
        required: true,
    },
    billingCycle: {
        type: String,
        enum: ['MONTHLY', 'YEARLY', 'LIFETIME'],
        required: true,
        trim: true,
    }

}, { timestamps: true });

const Orders = new mongoose.model('Order', orderSchema);

module.exports = Orders;