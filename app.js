// app.js
const express = require("express");
const bodyParser = require("body-parser");
const userService = require("./models/user_service");
const firestoreService = require("./models/firestore_services");
const {fdata} = require('./controller/chatController');
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { allowEIO3: true });
const profileRoute = require('./routes/profileRoute');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static( __dirname + '/public'));

//handleSocketConnections(io);
fdata(io);

app.use('/profile',profileRoute);

app.get("/profile/rawData", async (request, response) => {
  if (!userService.currentUser) {
    return response.redirect("/");
  }

  try {
    const user =userService.currentUser;
    response.status(201).json(user);
    
  } catch (error) {
    console.error(error);
    response.status(500).render("error", { message: "Failed to fetch chat data" });
  }
});

app.get('/', (request, response) => {
  if(userService.currentUser){
    console.log("Yes");
    response.redirect('/home');
  }
  response.render('index', {
    title: 'Hello',
    message: 'Welcome to the login page'
  });
});
app.get("/chat", async (request, response) => {
  if (!userService.currentUser) {
    return response.redirect("/");
  }

  try {
    
    response.render("chat", {
      title: "Chat",
      user: userService.currentUser,
      
    });
    
  } catch (error) {
    console.error(error);
    response.status(500).render("error", { message: "Failed to fetch chat data" });
  }
});


app.get('/login', (request, response) => {
  if(userService.currentUser){
    return response.redirect('/home')
  }else{
    response.render('login', {
      title: 'Login',
      message: 'Welcome to the login page'
    });
  }
  
});

app.get('/register', (request, response) => {
  response.render('reg', {
    title: 'Register',
    message: 'Welcome to the register page'
  });
  if(userService.currentUser){
    console.log(userService.currentUser);
  }else{
    console.log("No");
  }
});

app.get('/logout', (request, response) => {
  userService.logout().then(() => {
    console.log("Out");
    response.redirect('/');
  });
});

app.get('/home', (request, response) => {
  if (userService.currentUser) {
    const user = userService.currentUser;
    response.render('home', {
      title: 'Home',
      user: user
    });
    console.log("YES",userService.currentUser.user['uid']);
  } else {
    response.redirect('/');
  }
});





app.post("/register", async (req, res) => {
  const uData = req.body;
  try {
    const user = await userService.addUser(uData.first_Name,uData.last_Name,uData.email, uData.pwd);
    res.status(201).json(user);
  } catch (err) {
   // res.status(401).json({ error: err.message });
   if (err.code === "auth/weak-password") {
    console.error("Password is too weak");
    // Handle weak password error
} else if (err.code === "auth/email-already-in-use") {
    console.error("Email is already registered");
    // Handle email already in use error
} else {
    console.error("General error creating or updating user:", err);
    // Handle other errors
}
  }
});

app.post("/login", async (req, res) => {
  const uData = req.body;
  try {
    const user = await userService.authenticate(uData.email, uData.pwd);
    userService.currentUser = user;
    
    if (user) {
      res.render('home', {
        title: 'Home',
        user: user
      });
      console.log("YES",user.user['uid']);
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

/*const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));
*/


server.listen(3000, () => {
  console.log("Running!")
})