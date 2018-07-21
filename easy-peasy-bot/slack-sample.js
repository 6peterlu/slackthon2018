const slack = require('./slack.js');

const SPAM_CHANNEL_ID = "CBUG4MKJ7";

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

function testCreateChannel() {
  // peter: UBHG1NLK0
  // stacy: UBGNHC9AR
  let userIdList = ["UBHG1NLK0", "UBGNHC9AR"];
  let channelName = "test-channel-snowball";
  slack.createNewChannel(userIdList, channelName); // is this safe even when the channel already exists?
  let channelId = "CBU4C9Q49"; // testing testing
  slack.addUsersToNewChannel(channelId, userIdList);
}

function testPrefMessages() {
  slack.askUserForEventPreference();
  slack.askUserForTimePreference();
  slack.askUserForLocationPreference();
}

function testEventResponses() {
  slack.eventExistsResponse(dummyData[0]);
  slack.eventDoesntExistResponse(dummyData[0]);
}

function testIntroMessage() {
  slack.introToGroupChannel("test-channel-snowball");
}