ROT.RNG.setSeed(1234321);
var Game = {
	createDisplay: function(displayWidth, displayHeight) {
		return new ROT.Display({width: displayWidth, height: displayHeight});
	},

	createContainer: function(displayObject) {
		return displayObject.getContainer();
	},

	createColors: function(foregroundColor, backgroundColor) {
		return "%c{" + foregroundColor + "}%b{" + backgroundColor + "}";
	},

	createText: function(colors, string) {
		return colors + string;
	},

	createPlayer: function(openCells) {
		var index = Math.floor(ROT.RNG.getUniform() * openCells.length);
		var pos = openCells.splice(index, 1)[0];
		var posArr = pos.split(",");
		var x = parseInt(posArr[0]);
		var y = parseInt(posArr[1]);
		this.player = new Player(x, y);
		this.player.draw();
	},

	createMap: function() {
		var digger = new ROT.Map.Digger(120,40);
		var openCells = [[]];
		digger.create(function (x, y, ele) {
			if (ele) {
			this.map[x][y] = "#";
			return;
			}
			var pos = x + ',' + y;
			openCells.push(pos);
			this.map[x][y] = ".";
		}.bind(this));
		var rooms = digger.getRooms();
		for (var i=0; i<rooms.length; i++) {
		var room = rooms[i];
		room.getDoors(drawDoor);}
		function drawDoor(x,y){
			Game.map[x][y]= "+";
		}
		this.drawMap();
		this.createPlayer(openCells);
	},
 

	drawMap: function() {
		for (var x=0;x!=120;x++) {
			for (var y=0; y!=40 ;y++)
			{
				Game.display.draw(x, y, this.map[x][y]);
			}
		}
	},

	// Parameter stores
	
	display: null,
	container: null,
	player: null,
	map:[],
	gameOptions: {
		width: 120,
		height: 40
	},

	colors: {
		white:  ROT.Color.toRGB([255,255,255]),
		black: ROT.Color.toRGB([0,0,0]),
		red: ROT.Color.toRGB([255,0,0]),
		green: ROT.Color.toRGB([0,255,0]),
	},

	colorCombos : {},

	// Game Setup
	
	init: function() {
		this.display = this.createDisplay(this.gameOptions.width, this.gameOptions.height);
		this.container = this.createContainer(this.display);
		for (var z=0;z!=120;z++){
		this.map.push([]);}
		document.body.appendChild(this.container);

		this.colorCombos.whiteBlack = this.createColors(this.colors.white, this.colors.black);
		this.colorCombos.greenRed = this.createColors(this.colors.green, this.colors.red);

		var title = this.createText(this.colorCombos.greenRed, "rot.js Tutorial");
		this.display.drawText(0, 0, title);
		this.createMap();
		this.player.enableMovement();
	}

};

var Player = function(x, y) {
	this.x = x;
	this.y = y;
	this.draw = function() {
		Game.display.draw(this.x, this.y, "@", Game.colors.green);
	};
	this.enableMovement = function() {
		window.addEventListener("keydown", this);
	};
	this.handleEvent = function(e) {
	  var keyMap = {
	  	38: 0,
	  	39: 2,
	  	40: 4,
	  	37: 6,
	  };
	  if (e.keyCode in keyMap) {
		var dir = ROT.DIRS[8][keyMap[e.keyCode]];
		var newX = this.x + dir[0];
		var newY = this.y + dir[1];
		if (Game.map[newX][newY] == "+"){
		  Game.map[newX][newY] = "-";
		} else if (!(Game.map[newX][newY] == "." || Game.map[newX][newY] == "-")) {
	  	return;
		}
		Game.display.clear(); 
		this.x = newX;
		this.y = newY;
	}
	fov.compute(this.x, this.y, 10, function(x, y, r, visibility) {
		ch = Game.map[x][y]
		Game.display.draw(x, y, ch);
	});
	this.draw();
}}
//Perfected the light algrothim. 
var lightPasses = function(x, y) {
    if(Game.map[x][y]=="."||Game.map[x][y]=="-")
	{
		return true;
	} else{
		return false;
	}
}
var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
Game.init();

