class Level {
	constructor(seed, width, height) {
		ROT.RNG.setSeed(seed);
		var a = this;
		this.width = width;
		this.height = height;
		this.digger = new ROT.Map.Digger(this.width, this.height);
		this.map = [];
		for (var i = 0; i < this.width; i++) {
			this.map[i] = [];
		}
		this.digger.create(function(x, y, ele) {
			if (ele) {
				a.map[x][y] =  content.Terrain.wall;
			} else {
				a.map[x][y] = content.Terrain.floor;
			}
		})
		var room = this.digger._rooms;
		for (var i = 0; i < room.length; i++) {
			for (var k = 0; k < Object.keys(room[i]._doors).length; k++) {
				var coordinates = Object.keys(room[i]._doors)[k].split(',');
				a.map[coordinates[0]][coordinates[1]] = content.Terrain.cdoor;
			}
		}
		this.spawnPoint = [Math.floor(Math.random() * (this.digger._rooms[0]._x2 - this.digger._rooms[0]._x1 + 1)) + this.digger._rooms[0]._x1, Math.floor(Math.random() * (this.digger._rooms[0]._y2 - this.digger._rooms[0]._y1 + 1)) + this.digger._rooms[0]._y1]; // Gets digger._rooms[0] and choose a random point in the room to spawn in
	}
	draw() { // The playscreen is 59 by 29 at the top so the player must be drawn at 29,14
		var a = this;
		var lightPasses = function(x, y) {
			try {
				return !a.map[x][y].breaksLineOfSight;
			} catch (err) {
				return false;
			}
		}
		var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
    display.clear();
		fov.compute(player.coordinates[0], player.coordinates[1], 10, function(x, y, r, visibility) {
			var dx = x - player.coordinates[0] + 29;
			var dy = y - player.coordinates[1] + 14;
			display.draw(dx, dy, a.map[x][y].icon,ROT.Color.toRGB(a.map[x][y].fcolor),ROT.Color.toRGB(a.map[x][y].bcolor),);
			display._data[dx + ',' + dy].push([x, y])
		});
		display.draw(29, 14, "@");
	}
}

class Terrain {
	constructor(id, icon, fcolor,bcolor, breaksLineOfSight, solid) {
		this.id = id;
		this.icon = icon;
		this.fcolor = ROT.Color.fromString(fcolor);
    this.bcolor = ROT.Color.fromString(bcolor)
		this.breaksLineOfSight = breaksLineOfSight;
		this.solid = solid;
	}
}
