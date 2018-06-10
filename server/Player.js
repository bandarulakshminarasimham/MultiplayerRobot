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
    self.maxSpd = util.getPlayerMaxSpeed();
    self.color = util.getRandomColor();
    
    
    self.super_update = self.update;
    self.update = function(){
        self.updateSpd();
		self.super_update();
    };

    self.updateSpd = function(){
        self.resetSpdXY();
        if(self.pressingRight){
            self.spdX =  self.maxSpd; 
        } else if(self.pressingLeft){
            self.spdX =-  self.maxSpd; 
        } else {
            self.spdX = 0;
        }
		
		if(self.pressingUp){
            self.spdY =- self.maxSpd; 
        } else if(self.pressingDown){
            self.spdY = self.maxSpd; 
        } else {
            self.spdY = 0;	    
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
    }
    _player.update();

    if (data.event === 'onkeyup') {
        if(callback){
            callback(_player);
        }
    }   
    
    //return _player;
};

// listing the all payers list
Player.report = function(callback){
    if (callback) {
        callback(Player.list);
    }
    return Player.list;
};

// preparing packes of robot postion by players list
Player.update = function(){
    var packs = [];
    for (var key in Player.list) {
       var _player = Player.list[key];
       _player.update();
       packs.push({ x: _player.x, y: _player.y, shortname: _player.username.substring(0, 1), id: _player.id, username: _player.username, color: _player.color});
    }
    return packs;
};
module.exports = Player;