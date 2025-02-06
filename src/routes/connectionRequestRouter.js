const express = require('express');
const router = express.Router();

// Route for sending an 'interested' request to a user
router.post('/send/interested/:userId', (req, res) => {
    const { userId } = req.params;
    res.status(200).json({
        message: `📩 Request sent to user ${userId}`
    });
});

// Route for sending an 'ignored' request to a user
router.post('/send/ignored/:userId', (req, res) => {
    const { userId } = req.params;
    res.status(200).json({
        message: `🚫 Request ignored for user ${userId}`
    });
});

// Route for accepting a review request
router.post('/review/accepted/:requestId', (req, res) => {
    const { requestId } = req.params;
    res.status(200).json({
        message: `✅ Request ${requestId} accepted`
    });
});

// Route for rejecting a review request
router.post('/review/rejected/:requestId', (req, res) => {
    const { requestId } = req.params;
    res.status(200).json({
        message: `❌ Request ${requestId} rejected`
    });
});

module.exports = router;
