var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

var maxHeight = $(window).height() * 0.7;
var scrollable = $('.scrollable');

scrollable.css("min-height", maxHeight);
scrollable.css("max-height", maxHeight);


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
    var $message;

    if (typeof message.master === 'undefined') {
        $message = $('<li class="list-group-item"></li>');

    } else if (message.master === 'info') {
        $message = $('<li class="list-group-item list-group-item-info"></li>');

    } else if (message.master === 'danger') {
        $message = $('<li class="list-group-item list-group-item-danger"></li>');

    } else if (message.master === 'success') {
        $message = $('<li class="list-group-item list-group-item-success"></li>');
    }

    $message.append('<p><strong>' + message.name + '</strong> ' + moment().local().utc(momentStamp).format('h:mm a') + '</p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);

    $(".scrollable").animate({scrollTop: $('.scrollable')[0].scrollHeight}, 200);

});

$('#message-form').on('submit', function (event) {

    event.preventDefault();
    var message = $('#message');
    if (message.val().trim() === '') {
        return;
    }

    socket.emit('message', {
        name: name,
        text: message.val()
    });

    message.val('');
    $(".scrollable").animate({scrollTop: $('.scrollable')[0].scrollHeight}, 200);

});

$('.chatUsers').on('submit', function (event) {

    event.preventDefault();
    socket.emit('message', {
       text: '@currentUsers'
    });
});