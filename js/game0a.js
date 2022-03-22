

//import gsap from "./gsap.min.js";
class Circle {
    constructor(color, radius, v) {
        this.radius = radius;
        this.v = v;

        let circle = new PIXI.Graphics();
        circle.beginFill(color);
        circle.drawCircle(player.getPosX() + 200, player.getPosY() - 250, radius);
        circle.endFill();
        circle.x = radius;
        circle.y = radius;
        app.stage.addChild(circle);

        this.circle = circle;
    }

    remove() {
        app.stage.removeChild(this.circle);
    }

    collide(other) {
        let dx = other.circle.x - this.circle.x;
        let dy = other.circle.y - this.circle.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        return dist < (this.radius + other.radius);
    }
}

const time = 1.0;

class Rectangle {
    constructor(color, radius, v) {
        this.v = v;
        this.radius = radius;

        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(color);
        rectangle.drawRect(200, -250, 100, 50);
        rectangle.endFill();
        rectangle.x = radius;
        rectangle.y = radius;
        app.stage.addChild(rectangle);

        gsap.to(rectangle, { x: -200, duration: time, repeat: -1, yoyo: true, });

        this.rectangle = rectangle;
    }

    remove() {
        app.stage.removeChild(this.rectangle);
    }

    collide(other) {
        let dx = other.circle.x - this.rectangle.x;
        let dy = other.circle.y - this.rectangle.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        return dist < (2 + other.radius);
    }
}

class Monster extends Circle {
    update() {
        this.circle.x += this.v.x;
        this.circle.y += this.v.y;
    }

    setPos() {
        this.circle.x = player.getPosX();
        this.circle.y = player.getPosY();
    }
}

class Player extends Rectangle {
    constructor(color, radius, v) {
        super(color, radius, v);
        this.reset();
    }

    getPosX() {
        return this.rectangle.x;
    }

    getPosY() {
        return this.rectangle.y;
    }


    reset() {
        this.rectangle.x = w/2;
        this.rectangle.y = h/2;
        this.speed = 3;
    }

    update() {
        let x = this.rectangle.x + this.v.x ;
        let y = this.rectangle.y + this.v.y ;

        this.rectangle.x = Math.min(Math.max(x, this.radius), w-this.radius);
        this.rectangle.y = Math.min(Math.max(y, this.radius), w-this.radius);


        // // coin
        
    }
}

class Coin extends Circle {
    random() {
        this.circle.x = this.radius + Math.random()*(w - 2*this.radius);
        this.circle.y = this.radius + Math.random()*(h - 2*this.radius);
    }

    update() {
        let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
        this.circle.scale.set(s, s);
    }
}


function shake(className) {
    return;

   app.view.className = className;
   setTimeout(()=>{app.view.className = ""}, 50);
}

function addMonster() {
    monsters.push(new Monster(0x79a3b1, Math.random()*10 + 10, {x: Math.random(), y:10}));
}

function onkeydown(ev) {
    switch (ev.key) {
        /*
        case "ArrowLeft":
        case "a":
            player.v.x = -player.speed*2; 
            pressed['left'] = true;
            break;

        case "ArrowRight":
        case "d":
            player.v.x = player.speed*2;
            pressed['right'] = true;
            break;
            */

        case "ArrowUp":
        case "w":
            this.addMonster();
            pressed['up'] = true;
            break;
/*
        case "ArrowDown": 
        case "s":
            player.v.y = player.speed;
            pressed['down'] = true;
            break;
*/
    }
}
function onkeyup(ev) {
    switch (ev.key) {
         /*
        case "ArrowLeft": 
        case "a":
            player.v.x = pressed['right']?player.speed:0; 
            pressed['left'] = false;
            break;

        case "ArrowRight": 
        case "d":
            player.v.x = pressed['left']?-player.speed:0; 
            pressed['right'] = false;
            break;

            */

        case "ArrowUp": 
        case "w":
            this.addMonster();
            pressed['up'] = false;
            break;
/*
        case "ArrowDown": 
        case "s":
            player.v.y = pressed['up']?-player.speed:0; 
            pressed['down'] = false;
            break;

            */
    }
}

function setupControls() {
    window.addEventListener("keydown", onkeydown);
    //window.addEventListener("keyup", onkeyup);
}

function reset() {
    monsters.forEach(m => {
        m.remove();
    });

    monsters = [];
    //addMonster();
    player.reset();
    coin.random();
    updateCoins(0);
}

function updateCoins(num) {
    coins = num;
    document.querySelector('#score span').innerHTML = coins;
}

function gameLoop() {
    player.update();
    //coin.update();
    monsters.forEach(c => {
        c.update();
    });
    //this.addMonster();
}

// resize
window.onresize = () => {
    let d = document.querySelector("div#canvas");
    w = d.clientWidth;
    h = w;
    app.renderer.resize(w, h);
    reset();
}

let w = 512, h=512;
let app = new PIXI.Application({width: w, height: h, antialias:true});
let monsters = [];
let pressed = {};
let player = new Player(0xfcf8ec, 10, {x:0, y:0});
let coin = new Coin(0xfcf8ec, 10, {x:0, y:0});
let coins;

app.renderer.backgroundColor = 0x456268;
document.querySelector("div#canvas").appendChild(app.view);
setInterval(gameLoop, 1000/60);
setupControls();
window.onresize();