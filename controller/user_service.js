// user_service.js
const firebase = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
require('dotenv').config();
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  sessionCookieDomain: process.env.FIREBASE_SESSION_COOKIE_DOMAIN
};

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