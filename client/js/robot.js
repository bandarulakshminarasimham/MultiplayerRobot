$(function(){
    var ctx;
    ctx = document.getElementById("ctx").getContext("2d");
    var socket = io();
    socket.on('newPlayer', function(data){
        ctx.clearRect(0,0,515,515);
        for (let i = 0; i < data.length; i++) {
            var icon = '';
                ctx.fillStyle = data[i].color;
                ctx.font='20px FontAwesome';
                if (data[i].direction === 'west') {
                    icon = '\uf060';
                } else if (data[i].direction === 'east') {
                    icon = '\uf061';
                } else if (data[i].direction === 'north'){
                    icon = '\uf062';
                } else if (data[i].direction === 'south'){
                    icon = '\uf063';
                } 
                // up - f062 down - f063 
                ctx.fillText(icon , data[i].x, (data[i].y + 15));
        }
    });
    
    socket.on('updatePlayerActions', function(data) {
        var str = data.username + ' | ' + (data.x === -1 ? 0 :  data.x) + ' | ' + (data.y === -1 ? 0 : data.y) + ' | ' + data.direction;
        $('#results').append("<li style='color: "+ data.color +";'>"+ str  +"</li>");
    });

    socket.on('playerState', function(data){
        $('#results').append("<li style='color: red;'>"+ data.message  +"</li>");
    });

    document.onkeydown = function (event) {
        if (event.keyCode === 39) { // right
            socket.emit('moveGame', { inputId: 'right', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 40) {
            socket.emit('moveGame', { inputId: 'down', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 37) { 
            socket.emit('moveGame', { inputId: 'left', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 38) {
            socket.emit('moveGame', { inputId: 'up', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 76) {
            socket.emit('directionChange', { inputId: 'dleft', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 82) {
            socket.emit('directionChange', { inputId: 'dright', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 85) {
            socket.emit('directionChange', { inputId: 'dup', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 68) {
            socket.emit('directionChange', { inputId: 'ddown', state: true, event: 'onkeydown' });
        } 
    };
    document.onkeyup = function (event) {
        if (event.keyCode === 39) {
            socket.emit('moveGame', { inputId: 'right', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 40) {
            socket.emit('moveGame', { inputId: 'down', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 37) { 
            socket.emit('moveGame', { inputId: 'left', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 38) {
            socket.emit('moveGame', { inputId: 'up', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 76) {
            socket.emit('directionChange', { inputId: 'dleft', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 82) {
            socket.emit('directionChange', { inputId: 'dright', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 85) {
            socket.emit('directionChange', { inputId: 'dup', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 68) {
            socket.emit('directionChange', { inputId: 'ddown', state: false, event: 'onkeyup' });
        }
    };

    $("#btnStart").click(function(){
        socket.emit('startGame',{
            username: $("#startDiv-username").val()
        });
        $('#divStart').hide(200);
        $("#divContainer").show(200);
        $("#username").html($("#startDiv-username").val());
    });
    $("#divContainer").hide();
    $('#divStart').show();
    
});