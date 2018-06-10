(function (robot) {
    const Player = require('./Player');

    robot.init = function(serv){
        var io = require('socket.io')(serv, {});
        var sockets = {};
        // Establishing the socket connection
        io.sockets.on('connection', function(socket){
            sockets[socket.id] = socket;
            
            // Establishing the game environment and adding players into players list
            socket.on('startGame',function(data){
                Player.onConnect(socket.id, data.username, function (_player){
                    // after playger conneced successfully service notifies the all connected players regards the new player status
                    emitPlayerState(sockets, _player, 
                        { 
                            message: "Joined" 
                        });
                    emitPlayerActions(sockets, _player, { inputId: "" });
                    // creating listener for moveGame emit for new player
                    socket.on('moveGame', function(data){
                        Player.onMove(socket.id, data, function(_player){
                            emitPlayerActions(sockets, _player, data);
                        });
                    }); 
                });
               
            });
            // disconnecting the player socket connection
            socket.on('disconnect', function(){
                delete sockets[socket.id];
                Player.onDisconnect(socket.id, function(_player){
                    emitPlayerState(sockets, _player, { message: "Disconnected" });
                });
            });
        });
        
        // notifying the players robot events to client
        var emitPlayerActions = function(sockets, _player, data){
            for (var key in sockets) {
                var _socket = sockets[key];
                _socket.emit('updatePlayerActions', 
                { 
                    x: _player.x, 
                    y: (_player.maxY - _player.y), 
                    shortname: _player.username.substring(0, 1), 
                    id: _player.id, 
                    username: _player.username, 
                    direction: data.inputId, 
                    color: _player.color
                });
            }
        };

        // notifying players state as join and disconnected states
        var emitPlayerState = function(sockets, _player, data){
            for (var key in sockets) {
                var _socket = sockets[key];
                    _socket.emit('playerState', { message:  _player.username + " " + data.message });
            }
        };
        // Notifying the robot state to client
        setInterval(function(){
            var packs = Player.update();
            for (var key in sockets) {
                var _socket = sockets[key];
                _socket.emit('newPlayer', packs);
            }
        }, 1000/25);
    };
})(module.exports); 