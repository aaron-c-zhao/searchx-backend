"use strict";

const mongoose = require("mongoose");
const { la } = require("stopword");
const { last } = require("underscore");
const Chat = mongoose.model("Chat");
const chatbot = require("./chatbot");

////

exports.getChatMessageList = async function (sessionId) {
  const chat = await Chat.findOne({ sessionId: sessionId }, { messageList: 1 });
  if (chat === null) {
    return { messageList: [] };
  } else {
    return chat;
  }
};

exports.addChatMessage = async function (sessionId, data) {
  const initializeChat = async function () {
    const chat = new Chat({
      created: new Date(),
      sessionId: sessionId,
      messageList: [],
    });

    await chat.save();
    return chat;
  };

  const query = {
    sessionId: sessionId,
  };

  let chat = await Chat.findOne(query);
  if (chat === null) {
    chat = await initializeChat();
  }
  chat.messageList.push(data.message);
  chat.markModified("messageList");
  chat.save();
};

exports.notifyBot = async function(sessionId, data) {
    const message = data.message;
    const query = {
        "sessionId": sessionId
    }
    let reply = chatbot.parse(sessionId, message);

    let chat = await Chat.findOne(query);
    return reply.then(msg => {
        console.log(msg);
        if (msg !== null) {
            chat.messageList.push(msg);
            chat.markModified('messageList');
            chat.save();
        }
        return msg;
    })
    .catch(msg => {
        return msg;
    })
};
