var socket = io();

socket.on('connect', function () {
    console.log('Client connected!');
});

socket.on('message', function (message) {
    console.log('New message: ' + message.text);
    $('.message').append('<p>' + message.text + '</p>');
});

$('#message-form').on('submit', function (event) {

    event.preventDefault();
    var message = $('#message');

    socket.emit('message', {
        text: message.val()
    });

    message.val('');

});