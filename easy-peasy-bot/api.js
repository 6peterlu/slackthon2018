var exports = module.exports = {};

// const geocoder = require('google-geocoder'); // google geocoding api
const yelp = require('yelp-fusion'); // yelp-fusion api
const client = yelp.client(process.env.YELP_API_KEY);
const API_HOST = "https://api.yelp.com"
const search_path = "/v3/businesses/search"
const business_path = "/v3/businesses/"
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
// const geo = geocoder({
//   key: process.env.GOOGLE_API_KEY
// });
// NOTE: all geo calls cost $ so don't mess around too much
const GEO_ON = false;

// exports.findLatLongFromString = function(stringLocation, callback) {
//   if(GEO_ON) {
//     let res = geo.find(stringLocation, function(err, res) {
//       console.log(res[0]);
//       let locationInfo = {
//         lat: res[0].location.lat,
//         lng: res[0].location.lng,
//         addr: res[0].formatted_address
//       }
//       console.log("calling callback");
//       callback(locationInfo);
//     });
//   } else {
//     console.log("geo is off. not calling callback.");
//   }
// }

exports.sendEmail = function(email, imagesList) {
 let imagesDisplay = "";
 for (let image of imagesList) {
   imagesDisplay += '<a href="' + image + '"> Download picture </a><br />';
 }
 const msg = {
   to: email,
   from: 'pix@snowball.com',
   subject: 'Pictures from your event!',
   html: imagesDisplay,
 };
 sendgrid.send(msg);
}

exports.yelpRecs = function(term, location, callback) {
  let recs = [];
  client.search({
    term: term,
    location: location,
    limit: 3
  }).then(response => {
    if (response.jsonBody.total >= 3) {
      let i = 0;
      while (i < 3) {
        let res = response.jsonBody.businesses[i];
        recs.push(res);
        i++;
      }
    } else {
      let i = 0;
      while (i < response.jsonBody.total) {
        let res = response.jsonBody.businesses[i];
        recs.push(res);
        i++;
      }
    }
    callback(recs);
  });
}
