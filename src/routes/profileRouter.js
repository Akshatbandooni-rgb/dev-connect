const express = require('express');
const router = express.Router();


    
// Route to view user profile information (GET request)
router.get('/view', (req, res) => {
    res.status(200).json({
        message: '📊 User Profile Information retrieved successfully!'
    });
});

// Route to edit user profile information (PATCH request)
router.patch('/edit', (req, res) => {
    res.status(200).json({
        message: '✅ User profile updated successfully!'
    });
});

// Route to change user password (PATCH request)
router.patch('/password', (req, res) => {
    res.status(200).json({
        message: '🔐 Password updated successfully!'
    });
});

// Export the router to be used in the main app
module.exports = router;
