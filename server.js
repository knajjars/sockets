var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {

    socket.emit('message', {
        name: 'System',
        text: 'Start typing and hit enter to send a <i>Cüik</i> message!',
        timeStamp: moment().format('x').valueOf()
    });

    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);
        message.timeStamp = moment().format('x');
        io.emit('message', message);
    });

});

http.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});