var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

socket.on('connect', function () {
    console.log('Client connected!');
    console.log(name + ' joined ' + room + '!');

});

socket.on('message', function (message) {
    var momentStamp = message.timeStamp;

    $('.message').append('<p><strong>' +  moment().local().utc(momentStamp).format('h:mm a') + ' ' + message.name + ': </strong>' + message.text + '</p>');
});

$('#message-form').on('submit', function (event) {

    event.preventDefault();
    var message = $('#message');

    socket.emit('message', {
        name: name,
        text: message.val()
    });

    message.val('');

});