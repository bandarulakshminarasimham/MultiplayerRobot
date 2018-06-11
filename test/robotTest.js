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

    it('Mr Robot connected game - PLACE 0, 0, WEST', function(){
        var _player = player.onConnect(socket.id, 'Mr Robot');
        var message = util.ResponseMessage(_player, { inputId: "" });
        assert.equal(message, "PLACE 0, 0, WEST");
    });

    it('Mr Robot direct to right - PLACE 0, 0, NORTH', function(){
        var data = { inputId: "dright", event: 'onkeydown', state:false };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 0, 0, NORTH");
        });
    });


    it('Mr Robot move forward 1 step - PLACE 0, 1, NORTH', function(){
        var data = { inputId: "up", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 0, 1, NORTH");
        });
    });

    it('Mr Robot move forward 1 step - PLACE 0, 2, NORTH', function(){
        var data = { inputId: "up", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 0, 2, NORTH");
        });
    });

    it('Mr Robot direct to right - PLACE 0, 2, EAST', function(){
        var data = { inputId: "dright", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 0, 2, EAST");
        });
    });

    it('Mr Robot move forward 1 step - PLACE 1, 2, EAST', function(){
        var data = { inputId: "right", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 1, 2, EAST");
        });
    });

    it('Mr Robot move forward 1 step - PLACE 2, 2, EAST', function(){
        var data = { inputId: "right", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 2, 2, EAST");
        });
    });

    it('Mr Robot direct to left - PLACE 2, 2, NORTH', function(){
        var data = { inputId: "dleft", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 2, 2, NORTH");
        });
    });

    it('Mr Robot direct to down - PLACE 2, 2, SOUTH', function(){
        var data = { inputId: "ddown", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 2, 2, SOUTH");
        });
    });


    it('Mr Robot move forward 1 step - PLACE 2, 1, SOUTH', function(){
        var data = { inputId: "down", event: 'onkeydown', state:true };
        player.onMove(socket.id, data, function(_player){
            var message = util.ResponseMessage(_player, data);
            assert.equal(message, "PLACE 2, 1, SOUTH");
        });
    });

});
