// app.js
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const userService = require("./models/user_service");
const firestoreService = require("./models/firestore_services");
const { fdata } = require('./controller/chatController');
const http = require("http");
const path = require("path");
const session = require('express-session');
const profileRoute = require('./routes/profileRoute');
const logger = require('./utils/logger'); // Import Logger

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { allowEIO3: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS in production
}));

// Request Logger Middleware
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Initialize Chat Controller
fdata(io);

app.use('/profile', profileRoute);

// Middleware to expose user to all views if needed (optional)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get("/profile/rawData", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const user = req.session.user;
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching raw profile data: ${error.message}`);
    res.status(500).render("error", { message: "Failed to fetch data" });
  }
});

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/home');
  }
  res.render('index', {
    title: 'Hello',
    message: 'Welcome to the login page'
  });
});

app.get("/chat", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    res.render("chat", {
      title: "Chat",
      user: req.session.user
    });
  } catch (error) {
    logger.error(`Error rendering chat view: ${error.message}`);
    res.status(500).render("error", { message: "Failed to load chat" });
  }
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/home');
  }
  res.render('login', {
    title: 'Login',
    message: 'Welcome to the login page',
    error: null
  });
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/home');
  }
  res.render('reg', {
    title: 'Register',
    message: 'Welcome to the register page',
    error: null
  });
});

app.get('/logout', (req, res) => {
  userService.logout().then(() => {
    req.session.destroy(err => {
      if (err) {
        logger.error(`Error destroying session during logout: ${err.message}`);
      } else {
        logger.info("Session destroyed");
      }
      res.redirect('/');
    });
  }).catch(err => {
    logger.error(`Logout failed: ${err.message}`);
    res.redirect('/');
  });
});

app.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('home', {
      title: 'Home',
      user: req.session.user
    });
  } else {
    res.redirect('/');
  }
});

app.post("/register", async (req, res) => {
  // keys match views/reg.ejs
  const { First_Name, Last_Name, email, pwd } = req.body;

  if (!email || !pwd) {
    return res.render('reg', {
      title: 'Register',
      message: 'Email and Password are required',
      error: 'Missing credentials'
    });
  }

  try {
    await userService.addUser(First_Name, Last_Name, email, pwd);
    logger.info(`User registered successfully: ${email}`);
    res.redirect('/login');
  } catch (err) {
    logger.error(`Registration error for ${email}: ${err.message}`);
    let errorMsg = "Registration failed";
    if (err.code === "auth/weak-password") errorMsg = "Password is too weak";
    if (err.code === "auth/email-already-in-use") errorMsg = "Email is already registered";

    res.render('reg', {
      title: 'Register',
      message: errorMsg,
      error: err.code
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, pwd } = req.body;
  try {
    const userCredential = await userService.authenticate(email, pwd);
    req.session.user = userCredential;
    logger.info(`User logged in: ${email}`);
    res.redirect('/home');
  } catch (err) {
    logger.warn(`Login failed for ${email}: ${err.message}`);
    res.render('login', {
      title: 'Login',
      message: 'Invalid email or password',
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server started at port ${PORT}`);
});