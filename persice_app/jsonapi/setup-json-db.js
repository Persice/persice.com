var faker = require('faker');
var _ = require('lodash');

var fs = require('fs'),
  path = require('path'),
  dbFilePath = path.join(__dirname, 'db.json'),
  dbContent = {
    people: _.times(1, function(n) {
        return {
          id: 17,
          about: "I love crossfit and cake.",
          age: 37,
          distance: [
            "6,123",
            "miles"
          ],
          es_score: null,
          facebook_id: "1377081385948668",
          first_name: "Kranthi",
          friends_score: 0,
          gender: "f",
          goals: [{
            "become a certified yoga instructor": 0,
            "get sci-fi book recommendations": 0,
            "go rock climbing more often": 0,
            "join a tough mudder team": 0,
            "learn how to code django python": 1,
            "meet people who are into drones": 0
          }],
          image: "/media/images/facebook_profiles/2015/03/15/fb_image_1377081385948668.jpg",
          interests: [{
            "mountain biking": 0,
            "piano": 1,
            "volunteering": 0
          }],
          last_name: "Yemula",
          likes: [],
          linkedin_provider: null,
          lives_in: null,
          offers: [{
            "learn to paint": 0,
            "mentor people on public speaking": 0,
            "plan a trip to europe": 0,
            "show people local running trails": 0,
            "teach people about tech startups": 1
          }],
          photos: [{
            "cropped_photo": " ",
            "id": 121,
            "order": 0,
            "photo": "/media/images/facebook_profiles/2016/01/08/fb_image_560101450791647_1.jpg"
          }],
          position: {
            "company": null,
            "job": null
          },
          resource_uri: "/api/v1/auth/user/17/",
          score: 3,
          twitter_provider: null,
          twitter_username: null,
          connected: 1
      }
    })
};

fs.exists(dbFilePath, function(exists) {
  if (!exists) {
    fs.writeFile(dbFilePath, JSON.stringify(dbContent), {
      encoding: 'utf-8'
    });
  }
});
