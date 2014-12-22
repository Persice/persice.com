'use strict';
angular.module('beKindred')
.service('MatchFeedService', function MatchFeedService() {

    this.matches = {
        total: 4,
        current: 1,
        next: 2,
        match: {
            id: 1,
            first_name: 'Mark',
            last_name: 'Wahlberg',
            age: 35,
            distance: 40.3,
            about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, inventore molestias mollitia officiis reiciendis sequi vero iure in. Magnam ut cupiditate pariatur praesentium tenetur dicta nam natus nesciunt ducimus dolorem.',
            photos: [
            {photo: 'static/img/profile/photo0.jpg', order: 0},
            {photo: 'static/img/profile/photo1.jpg', order: 1},
            {photo: 'static/img/profile/photo2.jpg', order: 2},
            {photo: 'static/img/profile/photo3.jpg', order: 3},
            {photo: 'static/img/profile/photo4.jpg', order: 4},
            {photo: 'static/img/profile/photo5.jpg', order: 5}
            ],
            goals: [
            {subject: 'Learn python', match: 1},
            {subject: 'Learn django', match: 1},
            {subject: 'Learn laravel', match: 0},
            {subject: 'Learn ruby on rails', match: 0}
            ],
            offers: [
            {subject: 'Teach C++', match: 1},
            {subject: 'Teach how to play tennis', match: 1},
            {subject: 'Teach how to play soccer', match: 1},
            {subject: 'Teach how to play basketball', match: 1}
            ],
            likes: [
            {name: 'Interstellar movie', match: 1},
            {name: 'FC Barcelona', match: 0},
            {name: 'Manchester United', match: 0},
            {name: 'Miami Heat', match: 1}
            ],
            interests: [
            {description: 'Django', match: 1},
            {description: 'Programming', match: 0},
            {description: 'Hiking', match: 0},
            {description: 'Street basketball', match: 1}
            ],
            mutual: {
                friends: [],
                facebookfriends: [],
                twitterfriends: [],
                twitterfollowers: [],
                linkedinconnections: [],
            }
        }
    };


    this.data = [
    {
        id: 1,
        first_name: 'Mark',
        last_name: 'Wahlberg',
        age: 35,
        distance: 40.3,
        about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, inventore molestias mollitia officiis reiciendis sequi vero iure in. Magnam ut cupiditate pariatur praesentium tenetur dicta nam natus nesciunt ducimus dolorem.',
        photos: [
        {photo: 'static/img/profile/photo4.jpg', order: 0},
        {photo: 'static/img/profile/photo1.jpg', order: 1},
        {photo: 'static/img/profile/photo2.jpg', order: 2},
        {photo: 'static/img/profile/photo3.jpg', order: 3},
        {photo: 'static/img/profile/photo0.jpg', order: 4},
        {photo: 'static/img/profile/photo5.jpg', order: 5}
        ],
        goals: [
        {subject: 'Learn python', match: 1},
        {subject: 'Learn django', match: 1},
        {subject: 'Learn laravel', match: 0},
        {subject: 'Learn ruby on rails', match: 0}
        ],
        offers: [
        {subject: 'Teach C++', match: 1},
        {subject: 'Teach how to play tennis', match: 1},
        {subject: 'Teach how to play soccer', match: 1},
        {subject: 'Teach how to play basketball', match: 1}
        ],
        likes: [
        {name: 'Interstellar movie', match: 1},
        {name: 'FC Barcelona', match: 0},
        {name: 'Manchester United', match: 0},
        {name: 'Miami Heat', match: 1}
        ],
        interests: [
        {description: 'Django', match: 1},
        {description: 'Programming', match: 0},
        {description: 'Hiking', match: 0},
        {description: 'Street basketball', match: 1}
        ],
        mutual: {
            friends: [],
            facebookfriends: [],
            twitterfriends: [],
            twitterfollowers: [],
            linkedinconnections: [],
        }
    },
    {
        id: 2,
        first_name: 'Mira',
        last_name: 'Sorvino',
        age: 40,
        distance: 1.3,
        about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, inventore molestias mollitia officiis reiciendis sequi vero iure in. Magnam ut cupiditate pariatur praesentium tenetur dicta nam natus nesciunt ducimus dolorem.',
        photos: [
        {photo: 'static/img/profile/photo1.jpg', order: 0},
        {photo: 'static/img/profile/photo2.jpg', order: 1},
        {photo: 'static/img/profile/photo0.jpg', order: 2},
        {photo: 'static/img/profile/photo3.jpg', order: 3},
        {photo: 'static/img/profile/photo4.jpg', order: 4},
        {photo: 'static/img/profile/photo5.jpg', order: 5}
        ],
        goals: [
        {subject: 'Learn to dance', match: 1},
        {subject: 'Learn django', match: 1},
        {subject: 'Learn laravel', match: 0},
        {subject: 'Learn ruby on rails', match: 0}
        ],
        offers: [
        {subject: 'Teach how to swim', match: 1},
        {subject: 'Teach how to play tennis', match: 1},
        {subject: 'Teach how to play soccer', match: 1},
        {subject: 'Teach how to play basketball', match: 1}
        ],
        likes: [
        {name: 'Interstellar movie', match: 1},
        {name: 'FC Barcelona', match: 0},
        {name: 'Manchester United', match: 0},
        {name: 'Miami Heat', match: 1}
        ],
        interests: [
        {description: 'Django', match: 1},
        {description: 'Programming', match: 0},
        {description: 'Hiking', match: 0},
        {description: 'Street basketball', match: 1}
        ],
        mutual: {
            friends: [],
            facebookfriends: [],
            twitterfriends: [],
            twitterfollowers: [],
            linkedinconnections: [],
        }
    },
    {
        id: 3,
        first_name: 'Angelina',
        last_name: 'Jolie',
        age: 40,
        distance: 12.3,
        about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, inventore molestias mollitia officiis reiciendis sequi vero iure in. Magnam ut cupiditate pariatur praesentium tenetur dicta nam natus nesciunt ducimus dolorem.',
        photos: [
        {photo: 'static/img/profile/photo3.jpg', order: 0},
        {photo: 'static/img/profile/photo4.jpg', order: 1},
        {photo: 'static/img/profile/photo2.jpg', order: 2},
        {photo: 'static/img/profile/photo0.jpg', order: 3},
        {photo: 'static/img/profile/photo1.jpg', order: 4},
        {photo: 'static/img/profile/photo5.jpg', order: 5}
        ],
        goals: [
        {subject: 'Learn python', match: 1},
        {subject: 'Learn django', match: 1},
        {subject: 'Learn laravel', match: 0},
        {subject: 'Learn ruby on rails', match: 0}
        ],
        offers: [
        {subject: 'Teach C++', match: 1},
        {subject: 'Teach how to play tennis', match: 1},
        {subject: 'Teach how to play soccer', match: 1},
        {subject: 'Teach how to play basketball', match: 1}
        ],
        likes: [
        {name: 'Interstellar movie', match: 1},
        {name: 'FC Barcelona', match: 0},
        {name: 'Manchester United', match: 0},
        {name: 'Miami Heat', match: 1}
        ],
        interests: [
        {description: 'Django', match: 1},
        {description: 'Programming', match: 0},
        {description: 'Hiking', match: 0},
        {description: 'Street basketball', match: 1}
        ],
        mutual: {
            friends: [],
            facebookfriends: [],
            twitterfriends: [],
            twitterfollowers: [],
            linkedinconnections: [],
        }
    },
    {
        id: 4,
        first_name: 'James',
        last_name: 'Cameron',
        age: 55,
        distance: 0.3,
        about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, inventore molestias mollitia officiis reiciendis sequi vero iure in. Magnam ut cupiditate pariatur praesentium tenetur dicta nam natus nesciunt ducimus dolorem.',
        photos: [
        {photo: 'static/img/profile/photo0.jpg', order: 5},
        {photo: 'static/img/profile/photo1.jpg', order: 4},
        {photo: 'static/img/profile/photo2.jpg', order: 3},
        {photo: 'static/img/profile/photo3.jpg', order: 2},
        {photo: 'static/img/profile/photo4.jpg', order: 1},
        {photo: 'static/img/profile/photo5.jpg', order: 0}
        ],
        goals: [
        {subject: 'Learn python', match: 1},
        {subject: 'Learn django', match: 1},
        {subject: 'Learn laravel', match: 0},
        {subject: 'Learn ruby on rails', match: 0}
        ],
        offers: [
        {subject: 'Teach C++', match: 1},
        {subject: 'Teach how to play tennis', match: 1},
        {subject: 'Teach how to play soccer', match: 1},
        {subject: 'Teach how to play basketball', match: 1}
        ],
        likes: [
        {name: 'Interstellar movie', match: 1},
        {name: 'FC Barcelona', match: 0},
        {name: 'Manchester United', match: 0},
        {name: 'Miami Heat', match: 1}
        ],
        interests: [
        {description: 'Django', match: 1},
        {description: 'Programming', match: 0},
        {description: 'Hiking', match: 0},
        {description: 'Street basketball', match: 1}
        ],
        mutual: {
            friends: [],
            facebookfriends: [],
            twitterfriends: [],
            twitterfollowers: [],
            linkedinconnections: [],
        }
    },

    ];

    this.getData = function() {
        return this.data;
    };

    this.getMatchedCount = function() {
        return this.matched.length;
    };

    this.getMatches = function() {
        return this.matches;
    };

    this.setData = function(data) {
        this.data = data;
    };


    this.findNextMatch = function(nextId) {
        var newNext = 1;
        if (nextId === 1)  newNext = 2;
        if (nextId === 2)  newNext = 3;
        if (nextId === 3)  newNext = 4;
        if (nextId === 4)  newNext = 1;

        var nextMatch = {
            total: 4,
            current: nextId,
            next: newNext,
            match: this.findOne(nextId)
        };

        return nextMatch;
    };

    this.findOne = function(id) {
        // find the user that matches that id
        var list = $.grep(this.getData(), function(element, index) {
            return (element.id == id);
        });
        if(list.length === 0) {
            return {};
        }
        // even if list contains multiple items, just return first one
        return list[0];
    };

    this.findAll = function() {
        return this.getData();
    };

    this.findMatches = function() {
        return this.getMatches();
    };

    // options parameter is an object with key value pairs
    // in this simple implementation, value is limited to a single value (no arrays)
    this.findMany = function(options) {
        // find users that match all of the options
        var list = $.grep(this.getData(), function(element, index) {
            var matchAll = true;
            $.each(options, function(optionKey, optionValue) {
                if(element[optionKey] != optionValue) {
                    matchAll = false;
                    return false;
                }
            });
            return matchAll;
        });
    };

    // add a new data item that does not exist already
    // must compute a new unique id and backfill in
    this.addOne = function(dataItem) {
        // must calculate a unique ID to add the new data
        var newId = this.newId();
        dataItem.id = newId;
        this.data.push(dataItem);
        return dataItem;
    };

    // return an id to insert a new data item at
    this.newId = function() {
        // find all current ids
        var currentIds = $.map(this.getData(), function(dataItem) { return dataItem.id; });
        // since id is numeric, and we will treat like an autoincrement field, find max
        var maxId = Math.max.apply(Math, currentIds);
        // increment by one
        return maxId + 1;
    };

    this.updateOne = function(id, dataItem) {
        // find the user that matches that id
        var users = this.getData();
        var match = null;
        for (var i=0; i < users.length; i++) {
            if(users[i].id == id) {
                match = users[i];
                break;
            }
        }
        if(!angular.isObject(match)) {
            return {};
        }
        angular.extend(match, dataItem);
        return match;
    };

    this.deleteOne = function(id) {
        // find the user that matches that id
        var users = this.getData();
        var match = false;
        for (var i=0; i < users.length; i++) {
            if(users[i].id == id) {
                match = true;
                users.splice(i, 1);
                break;
            }
        }
        return match;
    };

});