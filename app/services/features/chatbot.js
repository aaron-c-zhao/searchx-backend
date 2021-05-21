'use strict'


let replyMsg = function(sessionId, text){ 
    return {
        author: "bot",
        data: {
            date: new Date(),
            text: text
        },
        sender: sessionId,
        type: "text"
    }
}


/*
parser message prefix.
@bot: bot is the recepiant
none: bot is not the recepiant
*/
function _parsePrefix(message) {
    let reg = /^@bot (.*)/i;
    let content = null;
    if (reg.test(message.data.text)) {
        content = message.data.text.match(reg)[1];
    }
    return content;
}



module.exports.parse = function(sessionId, message) {
        const messageContent = _parsePrefix(message);
        if (messageContent !== null) {
            console.log("Bot receives message: " + messageContent);
            return replyMsg(sessionId, messageContent);
        }
        else 
            return null;

}