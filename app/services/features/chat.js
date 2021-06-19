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
            chat.messageList.push(Object.assign({}, msg, {type:"text"}));
            chat.markModified('messageList');
            chat.save();
        }
        return msg;
    })
    .catch(msg => {
        return msg;
    })
};

// exports.notifyBot = async function (sessionId, data) {
//   return {
//     author: "bot",
//     data: {
//       date: "2021-06-18T07:56:46.327Z",
//       text: [
//         {
//           name: "LEF Restaurant & Bar Delft",
//           image: {
//             width: "50",
//             url: "https://media-cdn.tripadvisor.com/media/photo-t/11/e6/b8/a9/cheese-fondue-in-the.jpg",
//             height: "50",
//           },
//           rating: "4.0",
//           price_level: "",
//           website: "http://en.lefrestaurant.nl/",
//           address: "Doelenplein 2, 2611 BP Delft The Netherlands",
//           cuisine: [
//             {
//               key: "5086",
//               name: "French",
//             },
//             {
//               key: "10627",
//               name: "Dutch",
//             },
//           ],
//         },
//         {
//           name: "Restaurant & Eetcafe De Waag",
//           image: {
//             width: "50",
//             url: "https://media-cdn.tripadvisor.com/media/photo-t/18/ad/56/f9/voorkant-de-waag.jpg",
//             height: "50",
//           },
//           rating: "4.0",
//           price_level: "$$ - $$$",
//           website: "http://www.de-waag.nl/",
//           address: "Markt 11 Zuid Holland, 2611 GP Delft The Netherlands",
//           cuisine: [
//             {
//               key: "10648",
//               name: "International",
//             },
//             {
//               key: "10640",
//               name: "Bar",
//             },
//             {
//               key: "10654",
//               name: "European",
//             },
//             {
//               key: "10669",
//               name: "Contemporary",
//             },
//             {
//               key: "10697",
//               name: "Vegan Options",
//             },
//             {
//               key: "10665",
//               name: "Vegetarian Friendly",
//             },
//             {
//               key: "10992",
//               name: "Gluten Free Options",
//             },
//           ],
//         },
//         {
//           name: "De Centrale",
//           image: {
//             width: "50",
//             url: "https://media-cdn.tripadvisor.com/media/photo-t/18/16/02/cc/de-centrale-delft.jpg",
//             height: "50",
//           },
//           rating: "4.5",
//           price_level: "$$ - $$$",
//           website: "http://www.decentraledelft.nl/",
//           address: "Voldersgracht 2, 2611 ET Delft The Netherlands",
//           cuisine: [
//             {
//               key: "10627",
//               name: "Dutch",
//             },
//             {
//               key: "10654",
//               name: "European",
//             },
//             {
//               key: "10643",
//               name: "Seafood",
//             },
//             {
//               key: "10665",
//               name: "Vegetarian Friendly",
//             },
//             {
//               key: "10697",
//               name: "Vegan Options",
//             },
//             {
//               key: "10992",
//               name: "Gluten Free Options",
//             },
//           ],
//         },
//         {
//           name: "De Sjees",
//           image: {
//             width: "50",
//             url: "https://media-cdn.tripadvisor.com/media/photo-t/0b/7f/84/6d/ta-img-20160603-193601.jpg",
//             height: "50",
//           },
//           rating: "4.0",
//           price_level: "$$ - $$$",
//           website: "http://www.desjees.nl/",
//           address: "Markt 5, 2611 GP Delft The Netherlands",
//           cuisine: [
//             {
//               key: "10627",
//               name: "Dutch",
//             },
//             {
//               key: "10640",
//               name: "Bar",
//             },
//             {
//               key: "10642",
//               name: "Cafe",
//             },
//             {
//               key: "10654",
//               name: "European",
//             },
//             {
//               key: "10665",
//               name: "Vegetarian Friendly",
//             },
//             {
//               key: "10697",
//               name: "Vegan Options",
//             },
//             {
//               key: "10992",
//               name: "Gluten Free Options",
//             },
//           ],
//         },
//       ],
//     },
//     sender: "b616bd5a10937f7c6ff24ef943673c",
//     type: "result",
//   };
// };
