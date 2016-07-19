var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('Connected via IO');

    socket.emit('message', {
        text: 'Welcome to the chat app!'
    });

    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);
        io.emit('message', message);
    });

});

http.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});