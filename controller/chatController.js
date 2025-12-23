// chatController.js
const firestoreService = require('../models/firestore_services'); // Adjust the path if needed
const userService = require("../models/user_service");

module.exports = {
  fdata: async (io) => {
    io.on("connection", async (socket) => {
      try {
        const chatData = await firestoreService.getAllData("chatData");
        chatData.data.forEach(chatMessage => {
          io.emit('showmsg', chatMessage);
        });
      } catch (error) {
        console.error(error);
      }
      socket.on('disconnect', () => {
        // Handle disconnect
      });
      socket.on('msg', (data) => {
        const currentUser = userService.currentUser();
        if (currentUser) {
          const chatMessage = {
            uid: currentUser.user['uid'],
            time: new Date().getTime(),
            data: data.msg,
            userName: currentUser.user.providerData[0].displayName
          };
          firestoreService.addData('chatData', chatMessage);
          io.emit('showmsg', chatMessage);
        }
      });
    });
  }
};