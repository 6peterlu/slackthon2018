// /**
//  * A Bot for Slack!
//  */
//
//
// /**
//  * Define a function for initiating a conversation on installation
//  * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
//  */
//
// function onInstallation(bot, installer) {
//     if (installer) {
//         bot.startPrivateConversation({user: installer}, function (err, convo) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 convo.say('I am a bot that has just joined your team');
//                 convo.say('You must now /invite me to a channel so that I can be of use!');
//             }
//         });
//     }
// }
//
//
// /**
//  * Configure the persistence options
//  */

// var config = {};
// if (process.env.MONGOLAB_URI) {
//     var BotkitStorage = require('botkit-storage-mongo');
//     config = {
//         storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
//     };
// } else {
//     config = {
//         json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
//     };
// }
// //
//
// // /**
// //  * Are being run as an app or a custom integration? The initialization will differ, depending
// //  */
// //
// if (process.env.TOKEN || process.env.SLACK_TOKEN) {
//     //Treat this as a custom integration
//     var customIntegration = require('./lib/custom_integrations');
//     var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
//     var controller = customIntegration.configure(token, config, onInstallation);
// } else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
//     //Treat this as an app
//     var app = require('./lib/apps');
//     var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
// } else {
//     console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
//     process.exit(1);
// }
//
//
// /**
//  * A demonstration for how to handle websocket events. In this case, just log when we have and have not
//  * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
//  * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
//  * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
//  *
//  * TODO: fixed b0rked reconnect behavior
//  */
// // Handle events related to the websocket connection to Slack
// controller.on('rtm_open', function (bot) {
//     console.log('** The RTM api just connected!');
// });
//
// controller.on('rtm_close', function (bot) {
//     console.log('** The RTM api just closed');
//     // you may want to attempt to re-open
// });
//
//
// /**
//  * Core bot logic goes here!
//  */
// // BEGIN EDITING HERE!

// controller.on('bot_channel_join', function (bot, message) {
//     bot.reply(message, "I'm here!")
// });
//
// controller.hears('hello', 'direct_message', function (bot, message) {
//     bot.reply(message, 'Hello!');
// });
//
//
// /**
//  * AN example of what could be:
//  * Any un-handled direct mention gets a reaction and a pat response!
//  */
// controller.on('direct_message,mention,direct_mention', function (bot, message) {
//     bot.api.reactions.add({
//         timestamp: message.ts,
//         channel: message.channel,
//         name: 'robot_face',
//     }, function (err) {
//         if (err) {
//             console.log(err)
//         }
//         bot.reply(message, 'I heard you loud and clear boss.');
//     });
// });

var express = require('express');
var app = express();
var url = require('url');
var request = require('request');
// var api = require("./api.js")

var bodyParser = require('body-parser');

var slack = require('./slack.js'); // usage: slack.method_name

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', process.env.PORT);

app.post('/', function(req, res){
  console.log("hello");
  // console.log(req.body);
  console.log(req.body.payload);

  console.log(typeof(req.body.payload));

  let payload = JSON.parse(req.body.payload);

  let requestType =  payload.callback_id;

  // Add user if the current user id does not exist
  let currUserId = payload.user.id;

  var currUser;

  if(allUsers.includes(currUserId)) {
    currUser = userIdToUser[currUserId];
  } else {
    allUsers.push(currUserId);
    currUser = new Person(currUserId);
    userIdToUser[currUserId] = currUser;
  }

  if(requestType === "user_event_preference") {
    // Set user event preference

    console.log("getting: " + payload.actions[0].value)
    currUser.what = payload.actions[0].value

    slack.askUserForTimePreference(payload.channel.id);
  }

  else if(requestType === "user_time_preference") {
    // Set user time preference

    console.log("getting: " + payload.actions[0].selected_options[0].value)
    currUser.when = payload.actions[0].selected_options[0].value
    slack.askUserForLocationPreference(payload.channel.id);

    userIdToUser[payload.user.id].waitingForLocation = true;
  }

  // else if(requestType === "user_location_preference") {
  //   // Set user location preference
  //   currUser.where = "Twin Peaks"
  //   // Match user
  //   var matchresult = match(person, allgroups)
  //   slack.sendPlaintextMessage(payload.channel.id, matchresult)
  //   // res.send("matchresult")
  //   // go through list of groups and return "no group yet" or "group info: ... "
  // }

  // var group1 = new Group("hiking", "Saturday", "Twin Peaks");
  // group1.users.push("hi");
  // console.log(group1.users)

  // console.log(currUser.taken);

  // console.log(payload.callback_id);
  // res.send('It works!');
});


app.post('/events', function(req, res) {
  console.log("in events")

  var currUser;

  res.sendStatus(200);
  if(!req.body.event.hasOwnProperty('bot_id')) {
    console.log("NOT A BOT")
    // console.log(req)
    var text = req.body.event.text
    var currUserId = req.body.event.user

    if(allUsers.includes(currUserId)) {
      currUser = userIdToUser[currUserId];
    } else {
      allUsers.push(currUserId);
      currUser = new Person(currUserId);
      userIdToUser[currUserId] = currUser;
    }

    if(allUsers.includes(currUserId) && userIdToUser[currUserId].waitingForLocation === true) {
      console.log("waiting for location is true")
      userIdToUser[currUserId].where = text;
      userIdToUser[currUserId].waitingForLocation = false;
      console.log("set location. waiting for location is false")

      var matchresult = match(userIdToUser[currUserId], allgroups)
      slack.sendPlaintextMessage(req.body.event.channel, matchresult)
    }

    else {
      if(text.includes("hello")) {
        console.log("here?")

        console.log(req.body.event.channel)
        slack.sendPlaintextMessage(req.body.event.channel, "Hello there!")
        // sleep(1000).then(() => {
           // Do something after the sleep!
           slack.askUserForEventPreference(req.body.event.channel);
        // })
      }

      else if(text.includes("photos")) {
        // slack.getFilesFromChannel(req.body.event.channel, function(filesarray) {
        //   api.sendEmail("stacyviviphan@gmail.com", filesarray);
        // });
      }
    }
  }

  else {
    console.log("IS A BOT")
  }

  // res.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function sleep (time) {
 return new Promise((resolve) => setTimeout(resolve, time));
}



// check whether two preferences overlap each other (have the same range)
function overlap(a, b) {
  // considering  null case
  if (a == null || b == null) {
    return true;
  } else {
    return a == b // for now
  }

}

// function that matches a person to a group
function match(person, allgroups) {

  var gplen = allgroups.length;
  var bestid = 0
  var bestmatches = 0

  for (var i = 0; i < gplen; i++) {

    var curgp = allgroups[i]
    var same = 0

    same += overlap(person.what, curgp.what) ? 1 : 0;
    same += overlap(person.when, curgp.when) ? 1 : 0;
    same += overlap(person.where, curgp.where) ? 1 : 0;

    if (same > bestmatches) {
      bestid = i
      bestmatches = same
    }
  }

  if (bestmatches < 3) {
    newgp = new Group(person.what, person.when, person.where, "newgp" + Math.floor((Math.random() * 10000) + 1))
    newgp.users.push(person)
    allgroups.push(newgp)
    return "no matches yet, we will update you later."
  }

  bestgp = allgroups[bestid]
  person.curGroupid = bestgp.gpid
  bestgp.users.push(person)

  if (bestgp.created == false) {
    console.log("best group found. creating channel")
    bestgp.created = true
    // var tempPerson = bestgp.users[bestgp.users.length - 1]
    // console.log("Removing: " + tempPerson.usrID)

    var peterId = "UBHG1NLK0"

    var toRemove = -1;
    for (var j = 0; j < bestgp.users.length; j++) {
      if(bestgp.users[j].usrID === peterId) {
        toRemove = j;
      }
    }

    if(toRemove !== -1) {
      bestgp.users.splice(toRemove, 1)
    }

    console.log(bestgp.users)

    var userIdList = []

    for(var k = 0; k < bestgp.users.length; k++) {
      userIdList.push(bestgp.users[k].usrID);
    }

    console.log(userIdList)

    var bestChannelId = slack.createNewChannel("TestChannel" + bestgp.gpid, userIdList, function(channelId){
      console.log(channelId);
      slack.introToGroupChannel(channelId);

      if(bestgp.what === "restaurants") {
        slack.yelpRecs("restaurants", bestgp.where, channelId)
      }
    });
    // console.log(bestChannelId);
    // slack.introToGroupChannel(bestChannelId);
    bestgp.users.push(userIdToUser[peterId])
    bestgp.channelId = bestChannelId

  } else {
    slack.inviteUserToChannel(bestgp.channelId)
  }

  return "found peers with similar preference! groupid: ", bestgp.gpid + " event: " + bestgp.what + " time: " + bestgp.when + " location: " + bestgp.where


}

function reassign(person, allgroups) {
  // Match logic but temporarily take out the user's current group
  // allgroups.splice(, 1);
}


// Match: check what is not null in "what", "when", "where"
// Objects:
//    User:
//        userId (String)
//        currentGroup (String)
//        taken (boolean)
//        where (String)
//        when  (String)
//        what  (String)
//    Group
//      groupId
//      List of users
//      what
//      when
//      where
//    List of groups
//    List of total users
//    List of unassigned users
//

// States of a User: have preferences and in a group, have preferences but no group available,

function Person(usrid) {
  this.usrID = usrid;

  this.currGroupid = "";
  this.what = ""
  this.when = ""
  this.where = ""
  this.waitingForLocation = false;

  this.taken = false // set true when select "YES" to join channel | used to ask future preference
  this.preference = [3, 1, 2]
}

function Group(what, when, where, gpid) {
  this.what = what
  this.when = when
  this.where = where
  this.gpid = gpid
  this.channelid = ""

  this.created = false // true if >= 2 ppl  |  wheneer created become true, send msg about this new group
  this.users = []
}


var allgroups = [];
var allUsers = [];
var userIdToUser = new Object();
var groupIdToGroup = new Object();
// var newgpct = 0;

// group id to group obj
// channel id
