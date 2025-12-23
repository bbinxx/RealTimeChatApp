const firestoreService = require('../models/firestore_services');
const logger = require('../utils/logger');

module.exports = {
  fdata: async (io) => {
    io.on("connection", async (socket) => {
      logger.info(`User connected: ${socket.id}`);

      try {
        const chatData = await firestoreService.getAllData("chatData");
        if (chatData.success && chatData.data) {
          chatData.data.forEach(chatMessage => {
            socket.emit('showmsg', chatMessage);
          });
        }
      } catch (error) {
        logger.error(`Error loading chat history for ${socket.id}: ${error.message}`);
      }

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
      });

      socket.on('msg', (data) => {
        if (data.uid && data.msg) {
          const chatMessage = {
            uid: data.uid,
            time: new Date().getTime(),
            data: data.msg,
            userName: data.userName || "Anonymous"
          };
          // Fire and forget, but log errors if adding fails
          firestoreService.addData('chatData', chatMessage).then(res => {
            if (!res.success) logger.error('Failed to save chat message');
          });

          io.emit('showmsg', chatMessage);
          logger.info(`Message sent by ${data.uid}: ${data.msg.substring(0, 20)}...`);
        } else {
          logger.warn(`Invalid message data received from ${socket.id}: ${JSON.stringify(data)}`);
        }
      });
    });
  }
};