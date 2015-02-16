var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {origins: '*:*'});

var cookie_reader = require('cookie');
var querystring = require('querystring');
var redis = require('redis');
var redisAdapter = require('socket.io-redis');
var port = 3000;



server.listen(port);


io.adapter(redisAdapter({
    host: '127.0.0.1',
    port: 6379
}));

//Configure socket.io to store cookie set by Django
io.use(function(socket, next){

    if(socket.request.headers.cookie){
        socket.cookie = cookie_reader.parse(socket.request.headers.cookie);
        return next(null, true);
    }
    next(new Error('Authentication error'));

});

io.on('connection', function(socket){
    console.log('a user connected');

    // Create redis client
    client = redis.createClient();

    console.log(socket.cookie['sessionid']);
    console.log(socket.cookie['userid']);

    // Subscribe to the Redis events channel
    client.subscribe('message.' + socket.cookie['userid']);

    // Grab message from Redis and send to client
    client.on('message', function(channel, message){
        console.log('on message ' + socket.cookie['userid'], message);
        socket.send(message);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        client.unsubscribe('message.' + socket.cookie['userid']);
    });

    socket.on('newmessage', function(){
        console.log('new message');
    });

    // socket.on('notification', function(msg){
    //     console.log('message: ' + msg.body);
    //     socket.broadcast.emit('newmessage', msg);
    // });
});
