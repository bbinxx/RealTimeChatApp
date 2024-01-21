//profileController.js
const userService= require("../models/user_service");

exports.updateUserDetails = async (req, res) => {
  const newDisplayName = req.body.display_name;
  userService.updateUser(newDisplayName)
  res.redirect("/home");
};
  exports.getProfile = async (req, res) => {
    try {
      const user = await userService.currentUser;
      if(!user){
        res.redirect('/');
      }
      res.render('profile', { 
        user: user 
      });
     // console.log(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  };

  exports.deleteProfile = (req,res)=>{
    res.render('profile', { userData: userService.currentUser });
    
  }

  
  exports.createProfile = (req,res)=>{
    res.render('profile', { userData: userService.currentUser });
    
  }