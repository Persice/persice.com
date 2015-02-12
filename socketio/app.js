var express = require('express');

var app = express();
var port = 3000;

var io = require('socket.io').listen(app.listen(port));

var messages = [
{
    'title': 'The network is down!',
    'desc': 'The network is down and I cannot perform my work'
},
{
    'title': 'I lost my pen',
    'desc': 'I was near my cube when I noticed that my pen was gone!  Someone must have taken it.'
},
{
    'title': 'PC Load Letter',
    'desc': 'I wish I knew what it meant, but the printer is not working.'
},
{
    'title': 'My account is locked',
    'desc': 'I know that my password was correct even though it failed.  So I kept trying.  Only about 50 times.'
}
];

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('newmessage', function(){
        console.log('new message');
    });

    socket.on('notification', function(msg){
        console.log('message: ' + msg.body);
        socket.broadcast.emit('newmessage', msg);
    });
});
