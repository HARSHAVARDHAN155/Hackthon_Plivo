// adminUserModel.js

const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: { // Ensure you hash passwords before saving!
        type: String,
        required: true
    },
    role: { // For role-based access control
        type: String,
        enum: ['SuperAdmin', 'Admin', 'Support'],
        default: 'Admin'
    },
    lastLogin: {
        type: Date
    }
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
