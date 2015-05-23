var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    origins: '*:*'
});

var cookie_reader = require('cookie');
var querystring = require('querystring');
var redis = require('redis');
var redisAdapter = require('socket.io-redis');
var port = 8010;



server.listen(process.env.PORT || port);


// io.set('heartbeat interval', 15);
// io.set('heartbeat timeout', 40);
io.set("polling duration", 10);
io.set("close timeout", 3);

io.adapter(redisAdapter({
    host: '127.0.0.1',
    port: 6379
}));

//Configure socket.io to store cookie set by Django
io.use(function(socket, next) {

    if (socket.request.headers.cookie) {
        socket.cookie = cookie_reader.parse(socket.request.headers.cookie);
        return next(null, true);
    }
    next(new Error('Authentication error'));

});

io.on('connection', function(socket) {
    console.log('a user connected');

    // Create redis client
    clientNewMessage = redis.createClient();
    clientNewConnection = redis.createClient();

    console.log(socket.cookie['sessionid']);
    console.log(socket.cookie['userid']);

    // Subscribe to the Redis events channel for new messages
    clientNewMessage.subscribe('message.' + socket.cookie['userid']);

    // Subscribe to the Redis events channel for new connections
    clientNewConnection.subscribe('connection.' + socket.cookie['userid']);

    // Grab message from Redis and send to client
    clientNewMessage.on('message', function(channel, message) {
        console.log('on message ' + socket.cookie['userid'], message);
        socket.send(JSON.stringify({
            type: channel,
            message: message
        }));
    });

    // Grab new connection from Redis and send to client
    clientNewConnection.on('message', function(channel, message) {

        console.log('on connection ' + socket.cookie['userid'], message);
        socket.send(JSON.stringify({
            type: channel,
            message: message
        }));
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
        clientNewMessage.unsubscribe('message.' + socket.cookie['userid']);
        clientNewConnection.unsubscribe('connection.' + socket.cookie['userid']);
    });

});