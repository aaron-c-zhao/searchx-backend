'use strict';

const mongoose = require('mongoose');
const { la } = require('stopword');
const { last } = require('underscore');
const Chat = mongoose.model('Chat');

////

exports.getChatMessageList = async function(sessionId) {
    const chat = await Chat
        .findOne(
            {sessionId: sessionId},
            {messageList: 1}
        );
    if (chat === null){
        return {messageList: []};
    } else {
        return chat;
    }
};

exports.addChatMessage = async function(sessionId, data) {
    const initializeChat = async function() {
        const chat = new Chat({
            created: new Date(),
            sessionId: sessionId,
            messageList: []
        });

        await chat.save();
        return chat;
    };

    const query = {
        "sessionId": sessionId
    }

    let chat = await Chat.findOne(query);
    if (chat === null) {
        chat = await initializeChat();
    }
    chat.messageList.push(data.message);
    chat.markModified('messageList');
    chat.save();
};

exports.notifyBot = async function(sessionId, data) {
    const lastMessage = data.messageList.slice(-1)[0];
    const query = {
        "sessionId": sessionId
    }
    // TODO: now assume that when the bot get notified
    // there's already an entry in the database
    lastMessage.sender = sessionId;
    let chat = await Chat.findOne(query);
    chat.messageList.push(lastMessage);
    chat.markModified('messageList');
    chat.save();
    return lastMessage; 
}