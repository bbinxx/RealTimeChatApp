// user_service.js
const firebase = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
const firebaseConfig = require('../firebase_config');

firebase.initializeApp(firebaseConfig);

const auth = getAuth();

exports.addUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

exports.authenticate = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, update currentUser variable
    exports.currentUser = user;
  } else {
    // User is signed out, clear currentUser variable
    exports.currentUser = null;
  }
});

exports.logout = () => {
  return auth.signOut();
};
