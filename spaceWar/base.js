
class Player {
    constructor(a, b, c, d, e, f) {
        this.x = a;
        this.y = b;
        this.xvel = c;
        this.yvel = d;
        this.angle = e;
        this.keys = {};
        this.name = f;
        this.coolDown = 0;
    }
    get mass() {
        return options.player_mass;
    }
    get vertexs() {
        var points = [
            { x: 0, y: -10 },
            { x: -5, y: 5 },
            { x: 0, y: 5 },
            { x: 5, y: 5 },
            { x: 0, y: 0 },
            { x: -2.5, y: -2.5 },
            { x: 2.5, y: -2.5 }
        ]
        points.forEach(v => {
            v.x += this.x;
            v.y += this.y;
            var radians = this.angle - Math.PI / 2
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            var nx = (cos * (v.x - this.x)) + (sin * (v.y - this.y)) + this.x;
            var ny = (cos * (v.y - this.y)) - (sin * (v.x - this.x)) + this.y;
            v.x = nx;
            v.y = ny;
        })
        return points;
    }
    accel() {
        this.xvel += options.player_accel * Math.cos(this.angle);
        this.yvel += options.player_accel * Math.sin(this.angle);
    }
    move() {
        if (this.keys["Space"]) {
            if(this.coolDown == 0){
                bullets.push(new Bullet(this));
                WS.send('b');
                this.coolDown += 20 // Todo :Remove magic number
            }
        }
        if (this.keys["ArrowLeft"]) {
            this.angle += options.turn_speed;
        }
        if (this.keys["ArrowRight"]) {
            this.angle -= options.turn_speed;
        }
        if (this.keys["ArrowUp"]) {
            this.accel();
        }
        if (this.angle < 0) {
            this.angle += 2 * Math.PI
        }
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI
        }
        if (this.angle < 0) {
            this.angle += 2 * Math.PI
        }
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI
        }
        this.x += this.xvel;
        this.y -= this.yvel;
        if(this.coolDown > 0){
            this.coolDown--;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle + Math.PI / 2);
        ctx.beginPath()
        ctx.moveTo(0, -10)
        ctx.lineTo(-5, 5)
        ctx.lineTo(5, 5)
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}
class Bullet {
    constructor(parent) {
        this.x = parent.x + (options.bulletspeed + 12) * Math.cos(parent.angle);
        this.y = parent.y + -(options.bulletspeed + 12) * Math.sin(parent.angle);
        this.xvel = parent.xvel + options.bulletspeed * Math.cos(parent.angle);
        this.yvel = parent.yvel + options.bulletspeed * Math.sin(parent.angle);
    }
    move() {
        this.x += this.xvel;
        this.y -= this.yvel;
    }
    get mass() {
        return options.bullet_mass;
    }
    draw() {
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, options.bullet_radius * 2, options.bullet_radius * 2, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
/*
class AI {
    constructor(a) {
        this.ticks = -1;
        for (x in a) {
            this[x] = a[x];
        }
    }
    play() {
        this.ticks++;
        debugger;
        var da = Math.atan2(p2.xvel, p2.yvel);
        if(this.ticks > 300){
            da+= Math.PI/2
        }
        if (da < 0) {
            da += 2 * Math.PI
        }
        if (da > 2 * Math.PI) {
            da -= 2 * Math.PI
        }
        document.getElementById('info').innerHTML = `${p2.angle.toFixed(3)},${da.toFixed(3)}`
        if (Math.abs(p2.angle - da) < 0.1) {
            if (Math.abs(p2.xvel) < 0.1 && Math.abs(p2.yvel) < 0.1) {
                this.accel();
            }
        } else {
            //this.angle('clockwise');
            this.moveToAngle(da);
        }
    }
    moveToAngle(a) {
        if (p2.angle < a) {
            if (Math.abs(p2.angle + 2 * Math.PI, a) < a-p2.angle) {
                this.angle('clockwise')
            } else {
                this.angle('anticlockwise')
            }
        } else if(p2.angle > a){
            if(Math.abs(a + 2 * Math.PI, p2.angle) < p2.angle-a){
                this.angle('anticlockwise')
            } else {
                this.angle('clockwise')
            }
        }
    }
    shoot() {
        bullets.push(new Bullet(p2));
    }
    angle(a) {
        if (a == 'clockwise') {
            p2.angle -= options.turn_speed;
        } else if (a == 'counterclockwise' || a == 'anticlockwise') {
            p2.angle += options.turn_speed;
        }
        if (p2.angle < 0) {
            p2.angle += 2 * Math.PI
        }
        if (p2.angle > 2 * Math.PI) {
            p2.angle -= 2 * Math.PI
        }
    }
    accel() {
        p2.xvel += options.player_accel * Math.cos(p2.angle);
        p2.yvel += options.player_accel * Math.sin(p2.angle);
    }
 
}
*/
function dist(a, b, c, d) {
    return (Math.sqrt((a - c) ** 2 + (b - d) ** 2));
}
function apply_gravity(x) {
    var G = options.gravity_constant;
    var R = Math.sqrt((x.x - 250) ** 2 + (x.y - 250) ** 2) * options.r_multipler
    var Accel = (G * ((x.mass * options.starsmass) / R ** 2)) / x.mass;
    var Angle = Math.atan2(x.x - 250, x.y - 250) + Math.PI / 2
    var cos = Math.cos(Angle);
    var sin = Math.sin(Angle);
    x.xvel += Accel * cos
    x.yvel += Accel * sin
}
