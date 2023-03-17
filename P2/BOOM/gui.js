//-- Código secreto
const digits = document.getElementsByClassName("digito");

const sc0 = document.getElementById("sc-0");
const sc1 = document.getElementById("sc-1");
const sc2 = document.getElementById("sc-2");
const sc3 = document.getElementById("sc-3");
const displaySecretCode = [sc0, sc1, sc2, sc3];

const STATUS = {
    INIT: 0,
    OP: 1,
}
var secretCode = [];

let status = STATUS.INIT;

function digit(ev) {
    if (status == STATUS.INIT) {
        status = STATUS.OP;
        digit(ev);
    } else {
        pass;
    }
}

for (let b of digits) {
    b.onclick = digit;
}

function getSecretCode() {
    for (i=0; i<4; i++) {
        x = Math.floor(Math.random()*9);
        secretCode.push(x);
    }
}

function game(ev) {
    console.log(secretCode);
    for (i=0; i<secretCode.length; i++) {
        if (secretCode[i] == ev.target.value) {
            displaySecretCode[i].innerHTML = ev.target.value;
            displaySecretCode[i].style.color = "red";
        }
    }
}

//-- Elementos de la gui
const gui = {
    display : document.getElementById("display"),
    start : document.getElementById("start"),
    stop : document.getElementById("stop"),
    reset : document.getElementById("reset")
}

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    crono.start();
}
  
//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

//-- Reset del cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    crono.reset();
}