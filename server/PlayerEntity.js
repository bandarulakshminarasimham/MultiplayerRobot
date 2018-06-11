
var Entity = function(){
    var self = {
        x:0,
		y:0,
		spdX:0,
        spdY:0,
        maxX:100,
        maxY:100,
        minX: 0,
        minY: 0,
        id:"",
        direction: 'west'
    };
    self.update = function(){
        self.updatePosition();
    };

    self.updatePosition = function(){
        self.x += self.spdX;    
        self.y += self.spdY;

        if (self.x < self.minX) 
            self.x = self.minX;

        if (self.x >= self.maxX) 
            self.x = self.maxX;

        if (self.y < self.minY) 
            self.y = self.minY;

        if (self.y >= self.maxY) 
            self.y = self.maxY ;
    };

    self.resetSpdXY = function(){
        self.spdX = 0;
        self.spdY = 0;  
    };
    self.y = (self.y + self.maxY);
    return self;
};
module.exports = Entity;