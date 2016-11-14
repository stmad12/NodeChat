$(document).ready(function () {
    var socket = io.connect();
    socket.on('Welcome', function (data) {
        $('#log').append('<div><strong>' + data.text + '</strong></div>');
    });
    var name;
    $('#pass-enter').click(function(){
        var password = $('#pass-input');
        var realpassword = 'beer';
        var pwd = password.val().trim();
        if (password.val().trim() === realpassword){
            $('#user-name').prop('disabled', false);
            $('#user-save').prop('disabled', false);
            $('#user').prop('hidden',false);
            $('#pass-input').prop('hidden', true);
            $('#pass-enter').prop('hidden', true);
            $('#span1').prop('hidden', true);
            
        } else {
            alert('Incorrect Password');
        }
    });
    $('#user-save').click(function () {
        var username = $('#user-name');
        var txt = username.val().trim();
        console.log(txt);
        if (txt.length > 0) {
            name = txt;
            username.prop('hidden', true);
            $('#span2').hide();
            $(this).hide();
            $('#controls').show();
            $('#message').prop('disabled', false);
            $('#send').prop('disabled', false);
            socket.emit('user', name);
        }
    });
    $('#send').click(function () {
        var input = $('#message');
        var text = input.val().trim();
        if (text.length > 0) {
            socket.emit('message', text);
            //console.log('Message sent by', name,":'",text,"'");
        }
        input.val('');
    })
    socket.on('message', function (data) {
        $('#log').append('<div><strong>' + data.user + ': ' + data.message + '</strong></div>');
        console.log('Message sent by', data.user,":'", data.message,"'");
    });
    socket.on('otherUserConnect', function (data) {
        $('#log').append('<div><strong>' + data + ' connected</strong></div>');
    });
    socket.on('otherUserDisconnect', function (data) {
        $('#log').append('<div><strong>' + data + ' disconnected</strong></div>');
    });
    socket.on('displayname', function(){
        $('#user').append('<span>' + 'You choose the name: ' + socket.user  + '</span>');
    })
    // Pressing enter sends
    $("#user-name").keyup(function(event){
        if(event.keyCode == 13){
            $("#user-save").click();
        }
    });
    $("#pass-input").keyup(function(event){
        if(event.keyCode == 13){
            $("#pass-enter").click();
        }
    });
    $("#message").keyup(function(event){
        if(event.keyCode == 13){
            $("#send").click();
        }
    });
});