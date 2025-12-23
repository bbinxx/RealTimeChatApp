// profileRoute.js
const express = require('express');
const router = express.Router();

// Import the controllers for handling profile-related requests
const profileControllers = require('../controller/profileController');

// Define the route handlers for GET, POST, PUT, and DELETE requests to /profile
router.get('/', profileControllers.getProfile);
router.post('/', profileControllers.createProfile);
router.post('/updateProfile', profileControllers.updateUserDetails);
router.delete('/', profileControllers.deleteProfile);

module.exports = router;