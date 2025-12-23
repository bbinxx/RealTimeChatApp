// profileController.js
const userService = require("../models/user_service");
const logger = require('../utils/logger');

exports.updateUserDetails = async (req, res) => {
  const newDisplayName = req.body.display_name;

  if (!req.session.user) {
    logger.warn(`Unauthorized profile update attempt from IP: ${req.ip}`);
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Validate that server session matches requested user
    // We pass req.session.user to ensure we are updating the right person
    await userService.updateUser(req.session.user, newDisplayName);

    // Update local session data to reflect change immediately (if possible)
    // Note: This updates the session's copy, not the live auth object directly, but helps UI consistency
    if (req.session.user.user.providerData && req.session.user.user.providerData[0]) {
      req.session.user.user.providerData[0].displayName = newDisplayName;
    }

    logger.info(`User ${req.session.user.user.uid} updated display name to ${newDisplayName}`);
    res.status(200).json({ success: true, message: "Profile updated" });

  } catch (error) {
    logger.error(`Profile update failed for user ${req.session.user ? req.session.user.user.uid : 'unknown'}: ${error.message}`);
    res.status(500).json({ error: error.message || "Update failed" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Use session user to avoid global state issues and ensure correct data structure for view
    const user = req.session.user;

    if (!user) {
      return res.redirect('/');
    }
    // profile.ejs expects { user: { user: ... } } because it accesses user.user['uid']
    res.render('profile', { user: user });
  } catch (error) {
    logger.error(`Error fetching profile: ${error.message}`);
    res.status(500).render("error", { message: 'Failed to fetch user data' });
  }
};

exports.deleteProfile = (req, res) => {
  // Not implemented fully
  logger.warn("Delete profile not implemented");
  res.render('profile', { user: req.session.user });
};

exports.createProfile = (req, res) => {
  // Not implemented fully
  logger.warn("Create profile not implemented");
  res.render('profile', { user: req.session.user });
};