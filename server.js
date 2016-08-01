var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === 'undefined') {
        return;
    }

    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];

        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}


io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];

        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'Cüik spy',
                text: userData.name + ' has left :(',
                timeStamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });

    socket.emit('message', {
        name: 'Cüik spy',
        text: 'Start typing and hit enter to send a <i>Cüik</i> message!',
        timeStamp: moment().format('x').valueOf()
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'Cüik spy',
            text: req.name + ' has joined!',
            timeStamp: moment().valueOf()
        })
    });

    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);

        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        }
        else {
            message.timeStamp = moment().format('x');
            io.to(clientInfo[socket.id].room).emit('message', message);
        }
    });

});

http.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});