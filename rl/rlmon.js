ROT.RNG.setSeed(Math.floor((Math.random() * 100) + 1));
console.log(ROT.RNG.getSeed());
var you;
var monsters ={
bogeyman :{
	name:"Bogeyman",
	icon:"B",
	x: null,
	y: null,
	eyesight:12
}
};
var tiles = {
closedDoor:{
	name:"Closed door",
	icon:"+",
	solid:true,
	blocksLight:true
},
openDoor:{
	name:"Open door",
	icon:"-",
	solid:false,
	blocksLight:false 
},
wall:{
	name:"Wall",
	icon:"#",
	solid:true,
	blocksLight:true 
},
floor:{
	name:"Floor",
	icon:".",
	solid:false,
	blocksLight:false
}
};
var Game = {
	map:[],
	gameOptions: {
		width: 120,
		height: 40
	},
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
		you = new Player(x,y);
		you.draw();
	},

	createMap: function() {
		for (x = 0; x < this.gameOptions.width; x++){
			for (y = 0; y < this.gameOptions.height; y++){
			this.map[x][y] = {terrain:null};
			}
		}
		var digger = new ROT.Map.Digger(120,40);
		var openCells = [[]];
		digger.create(function (x, y, ele) {
			if (ele) {
			this.map[x][y].terrain = tiles.wall;
			return;
			}
			var pos = x + ',' + y;
			openCells.push(pos);
			this.map[x][y].terrain = tiles.floor;
		}.bind(this));
		var rooms = digger.getRooms();
		for (var i=0; i<rooms.length; i++) {
		var room = rooms[i];
		room.getDoors(drawDoor);}
		function drawDoor(x,y){
			Game.map[x][y].terrain= tiles.closedDoor;
		}
		this.drawMap();
		this.createPlayer(openCells);
	},
 

	drawMap: function() {
		for (var x=0;x!=this.gameOptions.width;x++) {
			for (var y=0; y!=this.gameOptions.height;y++)
			{
				Game.display.draw(x, y, this.map[x][y].terrain.icon);
			}
		}
	},

	// Parameter stores
	
	display: null,
	container: null,

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
		for (var z=0;z!=this.gameOptions.width;z++){
		this.map.push([]);}
		document.body.appendChild(this.container);
		this.colorCombos.whiteBlack = this.createColors(this.colors.white, this.colors.black);
		this.colorCombos.greenRed = this.createColors(this.colors.green, this.colors.red);
		var title = this.createText(this.colorCombos.greenRed, "rot.js Tutorial");
		this.display.drawText(0, 0, title);
		this.createMap();
		you.enableMovement();
	}

};
function Player(x, y){
	this.x = x;
	this.y = y;
	this.askingForDoorClose = false;
	this.draw = function() {
		Game.display.draw(this.x, this.y, "@", Game.colors.green);
	};
	this.enableMovement = function() {
		window.addEventListener("keydown", this);
	};
	this.handleEvent = function(e) {
		var newX = this.x;
		var newY = this.y;
		if (e.keyCode == 67){
			console.log("C");
			if (!this.askingForDoorClose){
				this.askingForDoorClose = true;
				return;
			} else {
				this.askingForDoorClose = false;
			}
		}if (this.askingForDoorClose){
					if (e.keyCode == 38){newY--;} // Up
					else if(e.keyCode == 40){newY++;} // Down 
					else if(e.keyCode == 37){newX--;} // Left 
					else if(e.keyCode == 39){newX++;} // Right
			if (Game.map[newX][newY].terrain.name == "Open door" ){
				Game.map[newX][newY].terrain = tiles.closedDoor;
				this.askingForDoorClose = false;
				reDrawScreen();
				return;
			} else {
				this.askingForDoorClose = false;
				reDrawScreen();
				return;
			}
		}
		if (e.keyCode == 38){newY--;} // Up
		else if(e.keyCode == 40){newY++;} // Down 
		else if(e.keyCode == 37){newX--;} // Left 
		else if(e.keyCode == 39){newX++;} // Right
		if (Game.map[newX][newY].terrain.name == "Closed door" ){
			Game.map[newX][newY].terrain = tiles.openDoor;
		} 
		if ((Game.map[newX][newY].terrain.solid)) {
			return;
		}
		this.x = newX;
		this.y = newY;
		reDrawScreen();
	};
}
//Perfected the light algorithm.
function reDrawScreen(){
	Game.display.clear(); 
	fov.compute(you.x, you.y, 10, function(x, y, r, visibility) {
		ch = Game.map[x][y].terrain.icon;
		Game.display.draw(x, y, ch);
	})
	you.draw();
} 
var lightPasses = function(x, y) {
	if (x<=0||y<=0||x>=Game.gameOptions.width||y>=Game.gameOptions.height){return false;}
    if(Game.map[x][y].terrain.blocksLight)
	{
		return false;
	} else{
		return true;
	}
}
var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
Game.init();
/* WIP path-finding
function passableCallback(x, y) {
    return Game.map[x][y].terrain.solid != true;
}
var dijkstra = new ROT.Path.Dijkstra(64, 7, passableCallback);
dijkstra.compute(47, 10, function(x, y) {
    console.log("x:"+ x + " y:" + y);
});
*/

