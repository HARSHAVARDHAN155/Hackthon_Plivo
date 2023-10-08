const express = require('express');
const router = express.Router();
const AdminUser = require('../models/adminUserModel.js');

router.get('/', async (req, res) => {
    try {
        const admins = await AdminUser.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// More routes...

module.exports = router;
