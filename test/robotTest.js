const assert = require('chai').assert;
const robot = require('../server/Robot');
const player = require('../server/Player');
const util = require('../server/util');

describe('robot', function(){

    var socket = require('net').Socket();
    socket.id = Math.random();
    robot.init(socket);
    
    //Start game
    it('Mr Robot started game', function(){
        socket.emit('startGame',{
            username: 'Mr Robot'
        });
    });

    //Move robot to left
    it('Mr Robot move to left', function(){
        socket.emit('moveGame',{ inputId: 'right', state: true, event: 'onkeydown' });
    });

    //Disconnectd game
    it('Mr Robot disconnected', function(){
        socket.emit('disconnect');
    });

    // player test cases

    it('Mr Robot connected game', function(){
        var _player = player.onConnect(socket.id, 'Mr Robot');
        var message = util.ResponseMessage(_player, { inputId: "" });
        console.log(message);
        assert.equal(message, "PLACE 0, 0, WEST");
    });

    it('Mr Robot move to right 1 step', function(){
        var data = { inputId: "right", event: 'onkeydown', state:true };
        player.onMove(socket.id, data);

        data = { inputId: "right", event: 'onkeyup', state:false };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            console.log(message);
            assert.equal(message, "PLACE 1, 0, EAST");
        });
    });

    it('Mr Robot move to up 1 step', function(){
        var data = { inputId: "up", event: 'onkeydown', state:true };
        player.onMove(socket.id, data);

        data = { inputId: "up", event: 'onkeyup', state:false };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            console.log(message);
            assert.equal(message, "PLACE 1, 1, NORTH");
        });
    });

    it('Mr Robot move to down 1 step', function(){
        var data = { inputId: "down", event: 'onkeydown', state:true };
        player.onMove(socket.id, data);

        data = { inputId: "down", event: 'onkeyup', state:false };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            console.log(message);
            assert.equal(message, "PLACE 1, 0, SOUTH");
        });
    });

    it('Mr Robot move to left 1 step', function(){
        var data = { inputId: "left", event: 'onkeydown', state:true };
        player.onMove(socket.id, data);

        data = { inputId: "left", event: 'onkeyup', state:false };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            console.log(message);
            assert.equal(message, "PLACE 0, 0, WEST");
        });
        
    });

});
