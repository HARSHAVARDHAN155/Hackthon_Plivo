// challanModel.js

const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
    challanId: {
        type: String,
        required: true,
        unique: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    violationType: {
        type: String,
        enum: ['Speeding', 'Illegal Parking', 'Red Light Violation'], // and so on
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    ownerDetails: {
        name: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        }
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    reminderSent: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Challan', challanSchema);
