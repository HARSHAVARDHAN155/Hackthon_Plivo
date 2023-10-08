const express = require('express');
const router = express.Router();
const SMSLog = require('../models/smsLogModel.js');

router.get('/', async (req, res) => {
    try {
        const logs = await SMSLog.find();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// More routes...

module.exports = router;
