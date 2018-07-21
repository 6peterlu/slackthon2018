const {WebClient} = require('@slack/client');

const web = new WebClient(process.env.OAUTH_TOKEN);

const SPAM_CHANNEL_ID = "CBUG4MKJ7";

const BOT_ON = true;

const LOGGING_ON = true;

var exports = module.exports = {};

// let userAndBotDM

let dummyData = [
  {type: 'hiking',
   time: 'January 5th',
   location: 'Twin Peaks',
   who: '',
  },
  {
    type: 'movies',
   time: 'January 10th',
   location: 'Embarcadero',
    who: '',
  }
]

exports.askUserForEventPreference = function() {
  if (LOGGING_ON) {
    console.log("askUserForEventPreference: starting");
  }
  let constructedMessageType = {
    text: "Fill out your event preferences",
    attachments: [
      {
        text: "Type",
        fallback: "You are unable to choose a type",
        callback_id: "user_event_preference",
        color: "#3AA3E3",
        attachment_type: "default",
        actions:[
        ]
      }
    ]
  };

  for (let event of dummyData) {
    constructedMessageType.attachments[0].actions.push({
      name: "type",
      text: event.type,
      type: "button",
      value: event.type
    });
  }
  if (BOT_ON) {
    web.chat.postMessage({
      channel:SPAM_CHANNEL_ID,
      text:constructedMessageType.text,
      attachments:constructedMessageType.attachments,
    });
  }
  if (LOGGING_ON) {
    console.log("askUserForEventPreference: finished");
  }
}

exports.askUserForTimePreference = function() {
  if (LOGGING_ON) {
    console.log("askUserForTimePreference: starting");
  }
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
   let constructedMessageTime = {
      text: "When are you free",
      attachments: [
        {
          text: "Time",
          fallback: "You are unable to choose a time",
          callback_id: "user_time_preference",
          color: "#3AA3E3",
          attachment_type: "default",
          actions:[
            {
              name: "times_list",
              text: "What time are you free?",
              type: "select",
              options: []
            }
          ]
        }
      ]
   };

  for (let day of days) {
    constructedMessageTime.attachments[0].actions[0].options.push({
      text: day,
      value: day
    });
  }
  if (BOT_ON) {
    web.chat.postMessage({
      channel:SPAM_CHANNEL_ID,
      text:constructedMessageTime.text,
      attachments:constructedMessageTime.attachments
    });
  }
  if (LOGGING_ON) {
    console.log("askUserForTimePreference: finished");
  }
}

exports.askUserForLocationPreference = function() {
  if (LOGGING_ON) {
    console.log("askUserForLocationPreference: starting");
  }
 let constructedMessageLocation = {
    text: "Where would you want to go?",
  };
  if (BOT_ON) {
    web.chat.postMessage({
      channel:SPAM_CHANNEL_ID,
      text:constructedMessageLocation.text,
    });
  }
  if (LOGGING_ON) {
    console.log("askUserForLocationPreference: finished");
  }
}

//Response when event exists
exports.eventExistsResponse = function(event) {
  let constructedMessageResponse = {
    text: "Here are the events that most fit your response: ",
    attachments: [
      {
        text: ":alarm_clock: When: " + event.time + "\n:world_map: Where: " + event.location + "\n:bulb: What: " + event.type + "\n:slightly_smiling_face: Who: " + event.who
      }
    ]
  }
  if (BOT_ON) {
      web.chat.postMessage({
        channel: SPAM_CHANNEL_ID,
        text: constructedMessageResponse.text,
        attachments: constructedMessageResponse.attachments
      });
    }
}

// Response when event doesn't exist
exports.eventDoesntExistResponse = function(event) {
  let constructedMessageResponse = {
      text: "No event match :cry: Do you want us to DM you when we find matches?",
      attachments: [
        {
          fallback: "You are unable to find events",
          callback_id: "no_events",
          color: "#3AA3E3",
          attachment_type: "default",
          actions:[
            {
                name: "options",
                text: "Yes",
                type: "button",
                style: "primary",
                value: "Yes"
            },
            {
                name: "options",
                text: "No",
                style: "danger",
                type: "button",
                value: "No"
            }
          ]
        }
      ]
  }
  if (BOT_ON) {
      web.chat.postMessage({
        channel: SPAM_CHANNEL_ID,
        text: constructedMessageResponse.text,
        attachments: constructedMessageResponse.attachments
      });
    }
}

// Invite to join channel
exports.inviteUserToChannel = function() {
  let constructedMessageInvite = {
    text: "A channel has been made for your event! Would you like to join?",
    attachments: [
      {
        text: "Invite",
        fallback: "You are unable to accept the invite.",
        callback_id: "test_id_snowball",
        color: "#3AA3E3",
        attachment_type: "default",
        actions:[
          {
              name: "options",
              text: "Yes",
              type: "button",
              style: "primary",
              value: "Yes"
          },
          {
              name: "options",
              text: "No",
              type: "button",
              style: "danger",
              value: "No"
          }
        ]
      }
    ]
  };

  if (BOT_ON) {
    web.chat.postMessage({
      channel: SPAM_CHANNEL_ID,
      text: constructedMessageInvite.text,
      attachments:constructedMessageInvite.attachments
    });
  }
}

exports.createNewChannel = function(channelName) {
  if (LOGGING_ON) {
    console.log("createNewChannelWithUsers: starting");
  }
  if (BOT_ON) {
    web.channels.create({
      token: process.env.USER_TOKEN,
      name: channelName
    });
    console.log("hi");
  }
  if (LOGGING_ON) {
    console.log("createNewChannelWithUsers: finished");
  }
}

// general endpoint for sending plaintext messages to a channel
exports.sendPlaintextMessage = function(channelId, message) {
  if (LOGGING_ON) {
    console.log("sendPlaintextMessage: starting");
  }
  if (BOT_ON) {
    web.chat.postMessage({
      channel:channelId,
      text:message,
    });
  }
  if (LOGGING_ON) {
    console.log("sendPlaintextMessage: finished");
  }
}

// Invites user to a new channel
exports.addUsersToNewChannel = function(channelId, userIdList) {
  if (LOGGING_ON) {
    console.log("addUsersToNewChannel: starting");
  }
  if (BOT_ON) {
    for (let user of userIdList) {
      web.channels.invite({
        token: process.env.USER_TOKEN,
        channel: channelId,
        user: user
      });
    }
  }
  if (LOGGING_ON) {
    console.log("addUsersToNewChannel: finished");
  }
}

// Intro message sent to a group channel when the channel is created
exports.introToGroupChannel = function(channelId) {
  let constructedMessageIntroGroup = {
    text: "Welcome to your group's channel! Now that you're here, you can figure out the details to meet. Here's an example call you can make to our pal Simple Poll to help you figure out those details: \n\n :zap: " + "`/poll 'What's your favorite sport?' 'Football' 'Tennis' anonymous`"
  };

  if (BOT_ON) {
    web.chat.postMessage({
      channel: channelId,
      text: constructedMessageIntroGroup.text,
    });
  }

}
