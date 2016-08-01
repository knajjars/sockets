var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

var maxHeight = $(window).height()*0.7;
var scrollable = $('.scrollable');

scrollable.css("min-height",maxHeight);
scrollable.css("max-height",maxHeight);


socket.on('connect', function () {
    $('.room-title').text(room);
    socket.emit('joinRoom', {
        name: name,
        room: room
    })
});

socket.on('message', function (message) {
    var momentStamp = message.timeStamp;
    var $messages = $('.messages');
    var $message = $('<li class="list-group-item"></li>');

    $message.append('<p><strong>' + message.name + '</strong> ' +  moment().local().utc(momentStamp).format('h:mm a') + '</p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);

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