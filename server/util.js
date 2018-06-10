const fs = require("fs");
const path = require("path");
const colour = require("colour");
const dateFormat = require("dateformat");
module.exports = {

    "getRandomColor": () => {
        var hex = Math.floor(Math.random() * 0xFFFFFF);
        return "#" + ("000000" + hex.toString(16)).substr(-6);
    },
    "config": () => {
        if (this.configInfo === undefined || this.configInfo === '') {
            this.configInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "/config.json")));
        }
        return this.configInfo;
    },
    "getPlayerConfig": () => {
        if (this.configInfo === undefined || this.configInfo === '') {
            this.configInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "/config.json")));
        }
        return (this.configInfo['env'][this.configInfo['stage']]);
    },
    "getPlayerMaxSpeed": () => {
        if (this.configInfo === undefined || this.configInfo === '') {
            this.configInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "/config.json")));
        }
        return (this.configInfo['env'][this.configInfo['stage']])['maxSpeed'];
    },
    "print": (msg) => {
        console.log(dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss").cyan + " > ".red + msg.red);
    },
    "ResponseMessage": function (_player, data) {
        var place = '';
        if (data.inputId === 'left') {
            place = 'WEST';
        } else if (data.inputId === 'right'){
            place = 'EAST';
        } else if (data.inputId === 'up'){
            place = 'NORTH';
        } else if (data.inputId === 'down'){
            place = 'SOUTH';
        } else {
            place = 'WEST';
        }
        return (`PLACE ${_player.x}, ${(_player.maxY - _player.y)}, ${place}`);
    } 
};