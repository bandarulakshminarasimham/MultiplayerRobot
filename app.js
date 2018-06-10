var express = require('express');
var app = express();
app.use(express.static('client'));
var serv = require('http').Server(app);

var robot = require("./server/Robot");
robot.init(serv);
        
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});


process.on('uncaughtException', (error) => {
    const colour = require("colour");
    const dateFormat = require("dateformat");
    console.log(dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss").cyan + " > ".red + error.red);
    process.exit(1);
});

serv.listen(2000);




