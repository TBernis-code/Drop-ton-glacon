//import gsap from "./gsap.min.js";
class Glacon {
    constructor(color, radius, v) {
        this.radius = radius;
        this.v = v;


        let glacon = new PIXI.Sprite.from("img/Glacon.png");
        glacon.anchor.set(0.5);
        glacon.x = player.getPosX();
        glacon.y = player.getPosY();
        glacon.width = 70;
        glacon.height = 50;
        app.stage.addChild(glacon);

        this.glacon = glacon;
    }

    remove() {
        console.log(monsters.length)
        app.stage.removeChild(this.glacon);
        monsters.pop();
    }

}

let time = 3;

class RectanglePlayer {
    constructor(color, radius, v) {
        this.v = v;
        this.radius = radius;

        let rectangle = new PIXI.Sprite.from("img/main2.png");
        rectangle.anchor.set(0.5);
        rectangle.x = 10;
        rectangle.y = 100;
        rectangle.width = 100;
        rectangle.height = 60;
        app.stage.addChild(rectangle);
        gsap.to(rectangle, { x: 550, duration: time, repeat: -1, yoyo: true, });

        /*
        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(color);
        rectangle.drawRect(200, -250, 100, 50);
        rectangle.endFill();
        rectangle.x = radius;
        rectangle.y = radius;
        app.stage.addChild(rectangle);
*/
        //gsap.to(rectangle, { x: -200, duration: time, repeat: -1, yoyo: true, });

        this.rectangle = rectangle;
    }

    remove() {
        app.stage.removeChild(this.rectangle);
    }

    collide(other) {
        let dx = other.glacon.x - this.rectangle.x;
        let dy = other.glacon.y - this.rectangle.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        return dist < (2 + other.radius);
    }
}

class RectanglePlateau {
    constructor(color, radius, v) {
        this.v = v;
        this.radius = radius;


        let rectangle = new PIXI.Sprite.from("img/plateau.png");
        rectangle.anchor.set(0.5);
        rectangle.x = 550;
        rectangle.y = 550;
        rectangle.width = 100;
        rectangle.height = 60;
        app.stage.addChild(rectangle);
        gsap.to(rectangle, { x: 50, duration: 3, repeat: -1, yoyo: true, });

        this.rectangle = rectangle;
    }

    remove() {
        app.stage.removeChild(this.rectangle);
    }

    collide(other) {
        let ab = other.glacon.getBounds()
        let bb = this.rectangle.getBounds()

        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }
}

function boxesIntersect(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}


class Ground {
    constructor(color, radius, v) {
        this.v = v;
        this.radius = radius;

        let rectangle = new PIXI.Sprite.from("img/barre.png");
        rectangle.anchor.set(0.5);
        rectangle.x = 0;
        rectangle.y = 600;
        rectangle.width = 1500;
        rectangle.height = 10;
        app.stage.addChild(rectangle);

        this.rectangle = rectangle;
    }

    remove() {
        app.stage.removeChild(this.rectangle);
    }

    collide(other) {
        let ab = other.glacon.getBounds()
        let bb = this.rectangle.getBounds()

        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    update() {

        monsters.forEach(m => {
            if (this.collide(m)) {
                console.log('fail');
                m.remove();
                return;
            }
        });


    }
}


class Monster extends Glacon {

    update() {
        this.glacon.x += this.v.x;
        this.glacon.y += this.v.y;

    }

    setPos() {
        this.glacon.x = player.getPosX();
        this.glacon.y = player.getPosY();
    }
}

class Player extends RectanglePlayer {
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
        //this.rectangle.x = w/2;
        //this.rectangle.y = h/2;
        this.speed = 3;
    }

    update() {
        let x = this.rectangle.x + this.v.x;
        let y = this.rectangle.y + this.v.y;

        this.rectangle.x = Math.min(Math.max(x, this.radius), w - this.radius);
        this.rectangle.y = Math.min(Math.max(y, this.radius), w - this.radius);


        // // coin

    }
}

class Plateau extends RectanglePlateau {
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
        //this.rectangle.x = w/2;
        //this.rectangle.y = h/2;
        this.speed = 3;
    }

    update() {
        let x = this.rectangle.x + this.v.x;
        let y = this.rectangle.y + this.v.y;

        this.rectangle.x = Math.min(Math.max(x, this.radius), w - this.radius);
        this.rectangle.y = Math.min(Math.max(y, this.radius), w - this.radius);

        monsters.forEach(m => {
            if (this.collide(m)) {
                const sound = new Howl({
                    src: ['./sound/iceCube.mp3']
                });
                sound.play();
                sound.volume(1.5);
                updateCoins(coins + 1);
                m.remove();
                return;
            }
        });


        // // collision

        if (this.collide(coin)) {
            updateCoins(coins + 1);
            coin.random();
            addMonster();
            this.speed = Math.min(4, this.speed + 0.2);
            ClickEvent("coins");

            return;
        }

    }
}

class Coin extends Glacon {
    random() {
        this.glacon.x = this.radius + Math.random() * (w - 2 * this.radius);
        this.glacon.y = this.radius + Math.random() * (h - 2 * this.radius);
    }

    update() {
        let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
        this.glacon.scale.set(s, s);
    }
}


function addMonster() {
    monsters.push(new Monster(0x79a3b1, Math.random() * 10 + 10, { x: Math.random(), y: 10 }));
    //new Monster(0x79a3b1, Math.random()*10 + 10, {x: Math.random(), y:10});
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
    //player.update();
    //coin.update();
    plateau.update();
    ground.update();
    //monster.update();

    monsters.forEach(c => {
        c.update();
        //if(boxesIntersect(plateau, c)) {
        //console.log("collision");
        //}
    });

}

function boxesIntersect(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function onClick() {
    if (monsters.length >= 1) {
        console.log('nope');
    } else {
        addMonster();
    }
}

// resize
window.onresize = () => {
    let d = document.querySelector("div#canvas");
    w = d.clientWidth;
    h = w;
    app.renderer.resize(w, h);
    reset();
}

let w = 512,
    h = 512;
let app = new PIXI.Application({ width: w, height: h, antialias: true });
app.stage.addChild(PIXI.Sprite.from('img/background.jpg'));

// Opt-in to interactivity
app.stage.interactive = true;

// Shows hand cursor
app.stage.buttonMode = true;

// Pointers normalize touch and mouse
app.stage.on('pointerdown', onClick);

let monsters = [];
let pressed = {};
let ground = new Ground(0xfcf8ec, 10, { x: 0, y: 0 });
let player = new Player(0xfcf8ec, 10, { x: 0, y: 0 });
let plateau = new Plateau(0xfcf8ec, 10, { x: 0, y: 0 });
let coin = new Coin();
let coins;

const sound = new Howl({
    src: ['./sound/music_background.mp3']
});
sound.play();
sound.volume(0.5);

const texture = PIXI.Texture.from('img/background.jpg');
const background = new PIXI.Sprite(texture);
app.renderer.background = background;
document.querySelector("div#canvas").appendChild(app.view);
setInterval(gameLoop, 1000 / 60);
window.onresize();