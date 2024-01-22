// chatController.js
const firestoreService = require('../models/firestore_services'); // Adjust the path if needed
const userService = require("../models/user_service");
  module.exports={
    fdata:async (io)=>{

      io.on("connection", async (socket) => {
       // console.log("User connected:"+socket.id);
        try {
          const chatData = await firestoreService.getAllData("chatData");
          chatData.data.forEach(chatMessage => { 
            //console.log("getAllData");
          // console.log(chatMessage);
           io.emit('showmsg',chatMessage); 
          }) ;
          
        } catch (error) {
          console.error(error);
          
        }
        socket.on('disconnect', () => {
          //console.log(socket.id + "-Disconnected");
        });
        
        socket.on('msg', (data) => {
          firestoreService.addData('chatData', 
          { 
            uid: userService.currentUser.user['uid'],
            time:new Date().getTime(),
            data: data.msg,
            userName:userService.currentUser.user.providerData[0].displayName
             
          }
          );
          io.emit('showmsg', { 
            uid: userService.currentUser.user['uid'],
            time:new Date().getTime(),
            data: data.msg,
            userName:userService.currentUser.user.providerData[0].displayName
            
          }
          );
          //console.log("addData");
          //console.log(msgInfo);  
        });
      });





      
}}