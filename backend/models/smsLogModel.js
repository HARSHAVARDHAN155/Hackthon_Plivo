// smsLogModel.js

const mongoose = require('mongoose');

const smsLogSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true
    },
    messageContent: {
        type: String,
        required: true
    },
    deliveryStatus: {
        type: String,
        enum: ['Delivered', 'Failed','Pending'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    relatedChallan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challan',
        required: true
    }
});

module.exports = mongoose.model('SMSLog', smsLogSchema);
