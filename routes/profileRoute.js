//profileRoute.js
const express = require('express');
const router = express.Router();

// Import the controllers for handling profile-related requests
const profileControllers = require('../controller/profileController');
const userService = require('../models/user_service');

// Define the route handlers for GET, POST, PUT, and DELETE requests to /profile
router.get('/', profileControllers.getProfile);
router.post('/', profileControllers.createProfile);
router.post('/updateProfile', profileControllers.updateUserDetails);
router.delete('/', profileControllers.deleteProfile);
router.get('/profile', (request, response) => {
  if (!userService.currentUser()) {
    response.redirect('/');
  }
});

// Export the router object for use in the main application file
module.exports = router;