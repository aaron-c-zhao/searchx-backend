'use strict'
var request = require('superagent')

let replyMsg = function(sessionId, text, type){ 
    return {
        author: "bot",
        data: {
            date: new Date(),
            text: text
        },
        sender: sessionId,
        type: type 
    }
}

module.exports.parse = function(sessionId, message) {
        // const messageContent = _parsePrefix(message);
        const messageContent = message.data.text;
        if (messageContent !== null) {
            console.log("Bot receives message: " + messageContent);
            return new Promise((resolve, reject) => {
                request
                    .post(`${process.env.RASA_PATH}/webhooks/rest/webhook`)
                    .send({
                        sender: sessionId,
                        message: messageContent
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                            reject(replyMsg(sessionId, "Bot is speechless.", "text"));
                        }
                        else {
                            if (!res.body[0]) {
                                resolve(null);
                            } 
                            else {
                                let text = res.body[0].text;
                                let type = "text"
                                if (res.body[0].custom) {
                                    text = res.body[0].custom.text
                                    type = res.body[0].custom.type
                                }
                                resolve(replyMsg(sessionId, text, type));
                            }
                        }
                    })
                });
       }
       else return null;

}