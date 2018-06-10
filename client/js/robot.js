$(function(){
    var ctx;
    ctx = document.getElementById("ctx").getContext("2d");
    ctx.font = '20px Arial';
    var socket = io();
    socket.on('newPlayer', function(data){
        ctx.clearRect(0,0,515,515);
        for (let i = 0; i < data.length; i++) {
            ctx.fillStyle = data[i].color;
            ctx.fillText(data[i].shortname , data[i].x, (data[i].y + 15));
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
        if (event.keyCode === 68 || event.keyCode === 39) {
            socket.emit('moveGame', { inputId: 'right', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 83 || event.keyCode === 40) {
            socket.emit('moveGame', { inputId: 'down', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 65 || event.keyCode === 37) { 
            socket.emit('moveGame', { inputId: 'left', state: true, event: 'onkeydown' });
        } else if (event.keyCode === 87 || event.keyCode === 38) {
            socket.emit('moveGame', { inputId: 'up', state: true, event: 'onkeydown' });
        }
    };
    document.onkeyup = function (event) {
        if (event.keyCode === 68 || event.keyCode === 39) {
            socket.emit('moveGame', { inputId: 'right', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 83 || event.keyCode === 40) {
            socket.emit('moveGame', { inputId: 'down', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 65 || event.keyCode === 37) { 
            socket.emit('moveGame', { inputId: 'left', state: false, event: 'onkeyup' });
        } else if (event.keyCode === 87 || event.keyCode === 38) {
            socket.emit('moveGame', { inputId: 'up', state: false, event: 'onkeyup' });
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