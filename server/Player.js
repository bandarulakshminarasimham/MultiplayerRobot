const util = require('./util');
const entity = require('./PlayerEntity');

var Player = function(id, username){
    var self = entity();
    self.id = id;   
    self.username = username;
	self.number = "" + Math.floor(10 * Math.random());
	self.pressingRight = false;
	self.pressingLeft = false;
	self.pressingUp = false;
    self.pressingDown = false;
    self.pressingWest = false;
    self.pressingEast = false;
    self.pressingNorth = false;
    self.pressingSouth = false;
    self.maxSpd = util.getPlayerMaxSpeed();
    self.color = util.getRandomColor();
    
    
    self.super_update = self.update;
    self.update = function(){
        self.updateSpd();
		self.super_update();
    };

    self.updateSpd = function(){
        self.resetSpdXY();

        switch (self.direction) {
            case ('west'):
                if(self.pressingRight){
                    self.spdX =  0; 
                } else if(self.pressingLeft){
                    self.spdX =-  self.maxSpd; 
                } else {
                    self.spdX = 0;
                }
            break;
            case ('east'):
                if(self.pressingRight){
                    self.spdX =  self.maxSpd; 
                } else if(self.pressingLeft){
                    self.spdX =  0; 
                } else {
                    self.spdX = 0;
                }
            break;
            case ('north'):
                if(self.pressingUp){
                    self.spdY =- self.maxSpd; 
                } else if(self.pressingDown){
                    self.spdY = 0; 
                } else {
                    self.spdY = 0;	    
                }
            break;
            case ('south'):
                if(self.pressingUp){
                    self.spdY = 0; 
                } else if(self.pressingDown){
                    self.spdY = self.maxSpd; 
                } else {
                    self.spdY = 0;	    
                }
            break;
        }
    };

    Player.list[id] = self;
    return self;
};

Player.list = {};
//Establishing the player object  
Player.onConnect = function(id, username, callback){
    var _player = Player(id, username);
    this.update();
    if (callback) {
        callback(_player);
    }   
    return _player;
};

// making response messages by player object
Player.ResponseMessage = function (_player){
    return util.ResponseMessage(_player);
};


Player.onDisconnect = function(id, callback){
    var _player = Player.list[id];
    delete Player.list[id];
    if (callback) {
        callback(_player);
    }
    return "disconnected";
};

// data: event object { inputId: 'left'/'right'/'up'/'down','dis' } 
//robot navigation
Player.onMove = function(id, data, callback){

    var _player = Player.list[id];
    if (data.inputId === "left") {
        _player.pressingLeft = data.state;
    } else if (data.inputId === "right") {
        _player.pressingRight = data.state;
    } else if (data.inputId === "up") {
        _player.pressingUp = data.state;
    } else if (data.inputId === "down") {
        _player.pressingDown = data.state;
    } else if ( data.event == 'onkeydown' && 
                (data.inputId === 'dleft' || 
                data.inputId === 'dright' || 
                data.inputId === 'dup' || 
                data.inputId === 'ddown')) {
        this.newDirection(id, data.inputId, data.state, _player.direction);
    } 
    _player.update();

    if (data.event === 'onkeyup') {
        if(callback){
            callback(_player);
        }
    }   
};

// listing the all payers list
Player.report = function(callback){
    if (callback) {
        callback(Player.list);
    }
    return Player.list;
};

Player.newDirection = function(id, command, state, olddir){
    var newdir = '';
    var _player = Player.list[id];
    if (olddir === 'west') {
        if (command === 'dleft') {
            newdir = 'south';
            _player.pressingSouth = state;
        } else if (command === 'dright') {
            newdir = 'north';
            _player.pressingNorth = state;
        } else if (command === 'dup') {
            newdir = 'west';
            _player.pressingWest = state;
        } else if (command === 'ddown'){
            newdir = 'east';
            _player.pressingEast = state;
        }
    } else if (olddir === 'east'){
        if (command === 'dleft') {
            newdir = 'north';
            _player.pressingNorth = state;
        } else if (command === 'dright') {
            newdir = 'south';
            _player.pressingSouth = state;
        } else if (command === 'dup') {
            newdir = 'east';
            _player.pressingEast = state;
        } else if (command === 'ddown'){
            newdir = 'west';
            _player.pressingWest = state;
        }
    } else if (olddir === 'north') {
        if (command === 'dleft') {
            newdir = 'west';
            _player.pressingWest = state;
        } else if (command === 'dright') {
            newdir = 'east';
            _player.pressingEast = state;
        } else if (command === 'dup') {
            newdir = 'north';
            _player.pressingNorth = state;
        } else if (command === 'ddown'){
            newdir = 'south';
            _player.pressingSouth = state;
        }
    } else if (olddir === 'south'){
        if (command === 'dleft') {
            newdir = 'east';
            _player.pressingEast = state;
        } else if (command === 'dright') {
            newdir = 'west';
            _player.pressingWest = state;
        } else if (command === 'dup') {
            newdir = 'south';
            _player.pressingSouth = state;
        } else if (command === 'ddown'){
            newdir = 'north';
            _player.pressingNorth = state;
        }
    }
    if (newdir === "west") {
        _player.direction = 'west';
    } else if (newdir === "east"){
        _player.direction = 'east';
    } else if (newdir === "north") {
        _player.direction = 'north';
    } else if (newdir === "south") {
        _player.direction = 'south';
    }
};
    
// preparing packes of robot postion by players list
Player.update = function(){
    var packs = [];
    for (var key in Player.list) {
       var _player = Player.list[key];
       _player.update();
       packs.push({
            x: _player.x, 
            y: _player.y, 
            shortname: _player.username.substring(0, 1), 
            id: _player.id, 
            username: _player.username, 
            color: _player.color,
            direction: _player.direction
        });
    }
    return packs;
};
module.exports = Player;