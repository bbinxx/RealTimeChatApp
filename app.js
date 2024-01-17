// app.js
const express = require("express");
const bodyParser = require("body-parser");
const userService = require("./controller/user_service");
const firestoreService = require("./controller/firestore_services");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.post('/addData', async (request, response) => {
  try {
    if(userService.currentUser){
      const data = await request.body.data; // Parse JSON data

      const result = await firestoreService.addData('chatData', { text: data });
      response.json({ message: 'Data added successfully' });
    }else{
      response.redirect('/');
    }

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to add data' });
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
    const chatData = await firestoreService.getAllData("chatData");
    response.render("chat", {
      title: "Chat",
      user: userService.currentUser,
      chatData: chatData.data,
    });
  } catch (error) {
    console.error(error);
    response.status(500).render("error", { message: "Failed to fetch chat data" });
  }
});


app.get('/login', (request, response) => {
  response.render('login', {
    title: 'Login',
    message: 'Welcome to the login page'
  });
  
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
    response.redirect('/login');
  });
});

app.get('/home', (request, response) => {
  if (userService.currentUser) {
    response.render('home', {
      title: 'Home',
      user: userService.currentUser
    });
    console.log("YES",userService.currentUser.uid);
  } else {
    response.redirect('/login');
  }
});



app.post("/register", async (req, res) => {
  const uData = req.body;
  try {
    const user = await userService.addUser(uData.email, uData.pwd);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const uData = req.body;
  try {
    const user = await userService.authenticate(uData.email, uData.pwd);
    userService.currentUser = user;
    console.log("In");
    res.redirect("/home");
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));


