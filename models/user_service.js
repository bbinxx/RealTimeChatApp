// user_service.js
const firebase = require("firebase/app");
const { getAuth,updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
const firebaseConfig = require('../firebase_config');

firebase.initializeApp(firebaseConfig);

const auth = getAuth();

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

exports.currentUser = () => currentUser;

exports.updateUser = (display_name) => {
  try {
    if (currentUser) {
      updateProfile(currentUser, {
        displayName: display_name,
        photoURL: "https://example.com/jane-q-user/profile.jpg"
      })
      .then(() => {
        console.log("Profile updated successfully!");
        currentUser.reload();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        if (error.code === 'auth/user-not-found') {
          console.log("Error: User not found.");
        } else if (error.code === 'auth/invalid-user-resource') {
          console.log("Error: Invalid user resource.");
        } else if (error.code === 'auth/operation-not-allowed') {
          console.log("Error: Operation not allowed.");
        } else {
          console.log("Error: Failed to update profile.");
        }
      });
    } else {
      console.log("No user signed in");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

exports.addUser = (first_Name, last_Name, email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

exports.authenticate = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

exports.logout = () => {
  return auth.signOut();
};


