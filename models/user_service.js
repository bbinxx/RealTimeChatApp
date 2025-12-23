// user_service.js
const firebase = require("firebase/app");
const { getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
const firebaseConfig = require('../firebase_config');
const logger = require('../utils/logger');

// Initialize Firebase
if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
  logger.info("Firebase initialized");
}

const auth = getAuth();

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    logger.info(`User state changed: ${user.uid} is logged in`);
  } else {
    logger.info("User state changed: No user logged in");
  }
  currentUser = user;
});

exports.currentUser = () => currentUser;

exports.updateUser = async (sessionUser, display_name) => {
  try {
    if (!currentUser) {
      throw new Error("Server user state is empty. Please login again.");
    }

    // Security Check: Ensure the session user matches the server's global user
    if (sessionUser && sessionUser.user && sessionUser.user.uid !== currentUser.uid) {
      const msg = `Session mismatch. Session: ${sessionUser.user.uid}, Server: ${currentUser.uid}`;
      logger.warn(msg);
      throw new Error("Session mismatch. You are not logged in as the active server user.");
    }

    await updateProfile(currentUser, {
      displayName: display_name,
      photoURL: "https://example.com/jane-q-user/profile.jpg"
    });
    logger.info(`Profile updated successfully for user ${currentUser.uid}`);
    await currentUser.reload();

  } catch (error) {
    logger.error(`Error updating profile: ${error.message}`);
    throw error;
  }
}

exports.addUser = async (first_Name, last_Name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: `${first_Name} ${last_Name}`
    });
    logger.info(`New user created: ${userCredential.user.uid}`);
    return userCredential;
  } catch (error) {
    logger.error(`Error adding user: ${error.message}`);
    throw error;
  }
};

exports.authenticate = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    logger.info(`User authenticated: ${userCredential.user.uid}`);
    return userCredential;
  } catch (error) {
    logger.warn(`Authentication failed for ${email}: ${error.message}`);
    throw error;
  }
};

exports.logout = () => {
  logger.info("User logging out");
  return auth.signOut();
};
