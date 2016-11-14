var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use('/', express.static(__dirname));
var server = http.listen(80, function () {
    console.log('hosting from ' + __dirname);
    console.log('server listening on http://localhost:3000/');
});
var users = [];
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.emit('Welcome', {
        text: ""
    });
    socket.on('user', function (name) {
        console.log(name + ' connected');
        users.push(name);
        socket.user = name;
        console.log('users : ' + users.length);
        socket.broadcast.emit('otherUserConnect', socket.user);
    });
    /*socket.on('nameis', function(){
        console.log('Someone choose the name ' + name);
        socket.user = name;
        socket.broadcast.emit('displayname');
    });*/
    socket.on('disconnect', function () {
        if (!socket.user) {
            return;
        }
        if (users.indexOf(socket.user) > -1) {
            console.log(socket.user + ' disconnected');
            users.splice(users.indexOf(socket.user), 1);
            socket.broadcast.emit('otherUserDisconnect', socket.user);
        }
    });
    socket.on('message', function (data) {
        io.sockets.emit('message', {
            user: socket.user
            , message: data
        })
    });
});