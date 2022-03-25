var speed = 3;
var life = 3;

class Glacon {
    constructor(color, radius, v) {
        this.radius = radius;
        this.v = v;


        let glacon = new PIXI.Sprite.from("img/Glacon.png");
        glacon.anchor.set(0.5);
        glacon.x = player.getPosX();
        glacon.y = player.getPosY();
        glacon.width = 30;
        glacon.height = 30;
        app.stage.addChild(glacon);

        this.glacon  = glacon;
    }

    remove() {
        app.stage.removeChild(this.glacon);
        monsters.pop();
    }

}


class RectanglePlayer {
    constructor(color, radius, v) {
        this.v = v;
        this.radius = radius;

        let d = document.querySelector("div#canvas");

        let rectangle = new PIXI.Sprite.from("img/main2.png");
        rectangle.anchor.set(0.5);
        //rectangle.x = 10;
        //rectangle.y = 100;
        rectangle.x = app.screen.width / 10;
        rectangle.y = app.screen.height / 5;
        rectangle.width = 100;
        rectangle.height = 60;
        app.stage.addChild(rectangle);
        gsap.to(rectangle, { x: d.clientWidth - 50, duration: speed, repeat: -1, yoyo: true, });


        this.rectangle = rectangle;
    }

    remove() {
        app.stage.removeChild(this.rectangle);
    }

    collide(other) {
        let dx = other.glacon.x - this.rectangle.x;
        let dy = other.glacon.y - this.rectangle.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        return dist < (2 + other.radius);
    }
}

class RectanglePlateau {
    constructor(color, radius, v) {
        this.v = v;
        this.radius = radius;

        let d = document.querySelector("div#canvas");
        console.log(d.clientWidth);

        let rectangle = new PIXI.Sprite.from("img/plateau.png");

        rectangle.anchor.set(0.5);
        rectangle.x = d.clientWidth - 45;
        rectangle.y = d.clientWidth - 45 ;
        rectangle.width = 130;
        rectangle.height = 90;
        app.stage.addChild(rectangle);
        let test = gsap.to(rectangle, { x: -d.clientWidth / 5 + 150, duration: speed, repeat: -1, yoyo: true, });
        test.play();

        this.rectangle = rectangle;
        this.test = test;
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
        rectangle.width =1500;
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
                life -= 1;
                if(life == 2) {
                    app.stage.removeChild(heart1);
                }
                else if(life == 1) {
                    app.stage.removeChild(heart2);
                }
                else {
                    app.stage.removeChild(heart3);

                    endGame();
                    console.log('loose');
                    endLoseText();
                    monsters.length = 2;
                }

                m.remove();
                return;
            }
        });


    }
}

function endGame() {
    plateau.remove();
    player.remove();
    soundAmbiance.stop();
    soundGlacon.stop();
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
        //this.reset();
    }

    getPosX() {
        return this.rectangle.x;
    }

    getPosY() {
        return this.rectangle.y;
    }


    reset() {
        //this.rectangle.x = 10;
        //this.rectangle.y = 100;
        gsap.to(this.rectangle, { x: 550, duration: speed, repeat: -1, yoyo: true, });
    }

    update() {
        if(speed == 2) {
        }

        // // coin

    }
}

class Plateau extends RectanglePlateau {
    constructor(color, radius, v) {
        super(color, radius, v);
        //this.reset();
    }

    getPosX() {
        return this.rectangle.x;
    }

    getPosY() {
        return this.rectangle.y;
    }


    reset() {
        let d = document.querySelector("div#canvas");
        //app.stage.removeChild(this.rectangle);
        //this.rectangle.x = 550;
        //this.rectangle.y = 550;
        //app.stage.addChild(this.rectangle);
        this.test.kill();
        this.rectangle.x = d.clientWidth - 45;;
        this.rectangle.y = d.clientWidth - 45;;
        this.test = gsap.to(this.rectangle, { x: -d.clientWidth / 5 + 150, duration: speed, repeat: -1, yoyo: true, });
        this.test.play();

    }

    update() {

        monsters.forEach(m => {
            if (this.collide(m)) {
                /*var context = new AudioContext();
                context.resume();
                soundGlacon.play();
                soundGlacon.volume(1.5);*/
                updateCoins(coins+1);
                if(speed>0.5) {
                    speed -= 0.5;
                }
                else{
                    speed = 3;
                }
                this.reset();
                m.remove();
                return;
            }
        });


        // // collision

        if (this.collide(coin)) {
            updateCoins(coins+1);
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
        this.glacon.x = this.radius + Math.random()*(w - 2*this.radius);
        this.glacon.y = this.radius + Math.random()*(h - 2*this.radius);
    }

    update() {
        let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
        this.glacon.scale.set(s, s);
    }
}


function addMonster() {
    monsters.push(new Monster(0x79a3b1, Math.random()*10 + 10, {x: Math.random(), y:10}));
    //new Monster(0x79a3b1, Math.random()*10 + 10, {x: Math.random(), y:10});
}

function reset() {
    monsters.forEach(m => {
        m.remove();
    });
    monsters = [];
    //addMonster();
    //player.reset();
    coin.random();
    updateCoins(0);
}

function updateCoins(num) {
    coins = num;
    document.querySelector('#score span').innerHTML = coins;
    if (coins >= 10) {

        endGame();
        endWinText();
        monsters.length = 2;
    }
}

function onkeydown(ev) {
    switch (ev.key) {
        case " ":
            if(monsters.length >= 1) {
                console.log('nope');
            }
            else {
                addMonster();
            }
            pressed[' '] = true;
            break;

    }
}

function setupControls() {
    window.addEventListener("keydown", onkeydown);
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
    if(monsters.length >= 1) {
        console.log('nope');
    }
    else {
        app.stage.removeChild(startGame);
        addMonster();
    }
}

// resize
window.onresize = () => {
    let d = document.querySelector("div#canvas");
    w = d.clientWidth;
    h = w;
    app.renderer.resize(w, h);
    background.width = w;
    background.height = h;
    //intro.width = w;
    //intro.height = h;
    reset();
}

let w = 600, h=600;
let app = new PIXI.Application({
    width: w,
    height: h,
    antialias:true,
});

const startGame = new PIXI.Container();

function startText() {

    let text1 = new PIXI.Text('Click to play',{fontFamily : 'Arial', fontSize: 35, fill : 0x000000, position: 'center'});
    text1.x = app.screen.width / 2 - 100;
    text1.y = app.screen.height / 2;

    startGame.addChild(text1);
    app.stage.addChild(startGame);
}

//app.stage.addChild(startGame);

const background = PIXI.Sprite.from('img/background.jpg');

// move the sprite to the center of the screen
background.width = app.screen.width +100;
background.height = app.screen.height +100;
app.stage.addChild(background);

//const intro = PIXI.Sprite.from('img/intro.jpg');

// move the sprite to the center of the screen
//intro.width = app.screen.width +100;
//intro.height = app.screen.height +100;
//app.stage.addChild(intro);

// End screen
function endLoseText() {
    let loseGame = PIXI.Sprite.from('img/lose.jpg');
    loseGame.width = w;
    loseGame.height = h;
    app.stage.addChild(loseGame);
}

// End screen
function endWinText() {
    let winGame = PIXI.Sprite.from('img/win.jpg');
    winGame.width = w;
    winGame.height = h;
    app.stage.addChild(winGame);
}

// Opt-in to interactivity
app.stage.interactive = true;

// Shows hand cursor
app.stage.buttonMode = true;

// Pointers normalize touch and mouse
app.stage.on('pointerdown', onClick);

let d = document.querySelector("div#canvas");

//Gestion Vies
const heart1 = PIXI.Sprite.from('img/heart.png');

// center the sprite's anchor point
heart1.anchor.set(0.5);

// move the sprite to the center of the screen
heart1.x = d.clientWidth - 15 ;
heart1.y = app.screen.height / 5 - 80;

heart1.width = 20;
heart1.height = 20;

app.stage.addChild(heart1);

const heart2 = PIXI.Sprite.from('img/heart.png');

// center the sprite's anchor point
heart2.anchor.set(0.5);

// move the sprite to the center of the screen
heart2.x = d.clientWidth - 35 ;
heart2.y = app.screen.height / 5 - 80;

heart2.width = 20;
heart2.height = 20;

app.stage.addChild(heart2);

const heart3 = PIXI.Sprite.from('img/heart.png');

// center the sprite's anchor point
heart3.anchor.set(0.5);

// move the sprite to the center of the screen
heart3.x = d.clientWidth - 55;
heart3.y = app.screen.height / 5 - 80;

heart3.width = 20;
heart3.height = 20;

app.stage.addChild(heart3);


let monsters = [];
let pressed = {};
let ground = new Ground(0xfcf8ec, 10, {x:0, y:0});
let player = new Player(0xfcf8ec, 10, {x:0, y:0});
let plateau = new Plateau(0xfcf8ec, 10, {x:0, y:0});
let coin = new Coin();
let coins;

const soundAmbiance = new Howl({
    src: ['./sound/music_background.mp3']
});
const soundGlacon = new Howl({
    src: ['./sound/iceCube.mp3']
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
unlockAudioContext(audioCtx);
audioCtx.resume();
soundAmbiance.play();
soundAmbiance.volume(0.5);

function unlockAudioContext(audioCtx) {
    if (audioCtx.state !== 'suspended') return;
    const b = document.body;
    const events = ['touchstart','touchend', 'mousedown','keydown'];
    events.forEach(e => b.addEventListener(e, unlock, false));
    function unlock() { audioCtx.resume().then(clean); }
    function clean() { events.forEach(e => b.removeEventListener(e, unlock)); }
}

let temp = 0;
$(".speaker").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("mute");
    if (temp % 2 == 0) {
        soundAmbiance.volume(0);
    }
    else {
        soundAmbiance.volume(0.5);
    }
    temp += 1;
});

function replay() {
    location.reload();
}
startText();
document.querySelector("div#canvas").appendChild(app.view);
setInterval(gameLoop, 1000/60);
setupControls();
window.onresize();
