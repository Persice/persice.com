var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  origins: '*:*'
});

var socketioJwt = require('socketio-jwt');

var redis = require('redis');
var redisAdapter = require('socket.io-redis');
var port = 8010;

server.listen(process.env.PORT || port);

// io.set('heartbeat interval', 15);
// io.set('heartbeat timeout', 40);
// io.set("polling duration", 10);
// io.set("close timeout", 3);

io.adapter(redisAdapter({
  host: '127.0.0.1',
  port: 6379
}));

io.use(socketioJwt.authorize({
  secret: 'zguhddh+2x9@!*@&_jdw7v*hslwv_)nx$sw@rwcr+$nppu7f*4',
  handshake: true
}));

io.on('connection', function(socket) {
  console.log('Socket Authenticated for user ' + socket.decoded_token.user_id);

  // Create redis client
  clientNewMessage = redis.createClient();
  eventChatNewMessage = redis.createClient();
  clientNewConnection = redis.createClient();
  clientEventDeleted = redis.createClient();

  // Subscribe to the Redis events channel for new messages
  clientNewMessage.subscribe('message.' + socket.decoded_token.user_id);

  // Subscribe to the Redis events channel for new event chat messages
  eventChatNewMessage.subscribe('chat_message.' + socket.decoded_token.user_id);

  // Subscribe to the Redis events channel for new connections
  clientNewConnection.subscribe('connection.' + socket.decoded_token.user_id);

  // Subscribe to the Redis events channel for deleted events
  clientEventDeleted.subscribe('event_deleted.' + socket.decoded_token.user_id);

  // Grab message from Redis and send to client
  clientNewMessage.on('message', function(channel, message) {
    message = JSON.parse(message);
    socket.emit('messages:new', message);
  });

  // Grab event chat message from Redis and send to client
  eventChatNewMessage.on('message', function(channel, message) {
    message = JSON.parse(message);
    socket.emit('messages:event', message);
  });

  // Grab new connection from Redis and send to client
  clientNewConnection.on('message', function(channel, message) {
    message = JSON.parse(message);
    socket.emit('connections:new', message);
  });

  // Grab new event deleted from Redis and send to client
  clientEventDeleted.on('message', function(channel, message) {
    message = JSON.parse(message);
    socket.emit('event:deleted', message);
  });

  socket.on('disconnect', function() {
    clientNewMessage.unsubscribe('message.' + socket.decoded_token.user_id);
    clientNewConnection.unsubscribe('connection.' + socket.decoded_token.user_id);
    clientEventDeleted.unsubscribe('event_deleted.' + socket.decoded_token.user_id);
    eventChatNewMessage.unsubscribe('chat_message.' + socket.decoded_token.user_id);
  });

});
