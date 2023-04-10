//-- CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

//-- GRAPHIC & MUSIC ELEMENTS
const zoro = new Image();
zoro.src = "zoro.png";
const sword = new Image();
sword.src = "espada.png";
const barrel = new Image();
barrel.src = "barrel.png";
const sound_win = new Audio("win.mp3");
const sound_gameover = new Audio("game_over.mp3");

//-- ELEMENTS
const STATUS = {
    INIT: 0,
    OP: 1,
}
const gui = {
    display : document.getElementById("display"),
    start : document.getElementById("start"),
    reset : document.getElementById("reset")
}
const crono = new Crono(gui.display);
const angleValue = document.getElementById("angle");
const angleValue_display = document.getElementById("angle_display");
const speedValue = document.getElementById("speed");
const speedValue_display = document.getElementById("speed_display");

angleValue.oninput = () => {
    angleValue_display.innerHTML = angleValue.value;
}
speedValue.oninput = () => {
    speedValue_display.innerHTML = speedValue.value;
}

// MATH FUNCTIONS
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function range(start, stop=undefined, step=1) {
    const startArray = stop === undefined ? 0 : start;
    const stopArray = stop === undefined ? start : stop;

    return Array.from({length: (stopArray - startArray) / step + 1}, (_, i) => startArray + (i * step));
}

//-- PLAY SOUND
function music(sound) {
    sound.currentTime = 0;
    sound.play();
}

//-- SPACE BAR
window.onkeydown = (e) => {
    if (e.key == "d" || e.key == "D") {
        gui.start.onclick();
    }
}

//-- DRAW
function draw(img, x, y, size) {
    ctx.beginPath();
    ctx.drawImage(img, x, canvas.height - y, size, size);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

//-- SWORD MOVEMENT
function movement(s, t) {
    var speedX = s * Math.cos((angle * Math.PI)/180);
    var speedY = s * Math.sin((angle * Math.PI)/180);
    x += speedX * t;
    y += speedY * t - 0.5 * g * t * t;
}

//-- GAME
let x0 = getRandom(200, 700);
const y0 = 140;
var x = 20;
var y = 140;

const g = 9.8;
var speed = 0;
speedValue.value = 0;
var angle = 0;
angleValue.value = 0;
var time = 0;
var state = STATUS.INIT;

function game() {
    
    if (range(Math.round(x0) - 30, Math.round(x0) + 30).includes(Math.round(x)) && range(Math.round(y0) - 50, Math.round(y0) + 50).includes(Math.round(y))) {
        crono.stop();
        music(sound_win);
        state = STATUS.INIT;

        console.log("USER WON");
        alert("¡Has ganado! Lo conseguiste en: " + crono.display.innerHTML);
        gui.reset.onclick();
    } else if (y <= 100) {
        crono.stop();
        state = STATUS.INIT;
        x = 20;
        y = 140;
        speed = 0;
        time = 0;
        requestAnimationFrame(game);
        
        music(sound_gameover);
        console.log("GAME OVER");
        alert("¡Has perdido! Inténtalo de nuevo o prueba a empezar otro juego :c.");
    } else {
        if (state == STATUS.OP) {
            speed = speedValue.value * 0.123;
            angle = angleValue.value;
            time += 0.04;
        } else {
            crono.stop();
        }
        
        movement(speed, time);
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(zoro, 20, 200, 150);
        draw(barrel, x0, y0, 85);
        draw(sword, x, y, 85);
    
        requestAnimationFrame(game);
    }
}

// BUTTONS
const start = document.getElementById("start");
const reset = document.getElementById("reset");

gui.start.onclick = () => {
    console.log("START");
    crono.start();
    state = STATUS.OP;
}

gui.reset.onclick = () => {
    console.log("RESET");
    crono.stop();
    crono.reset();
    x = 20;
    y = 140;
    x0 = getRandom(200, 700);
    speed = 0;
    time = 0;
    state = STATUS.INIT;
    requestAnimationFrame(game);
}

game();