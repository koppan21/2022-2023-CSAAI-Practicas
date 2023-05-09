console.log("Montando la red...");

const gui = {
  bsend : document.getElementById("bsend"),
  resend : document.getElementById("resend"),
  delay : document.getElementById("delay"),
  delayValue : document.getElementById("delay_value"),
  node : document.getElementById("node"),
  nodeValue : document.getElementById("node_value")
}

//-- Obtener elementos del DOM
const canvas = document.getElementById('canvas');
const imgBack = document.getElementById('imagesrchide');
const imgCloud = document.getElementById('cloud');
const imgFront = document.getElementById('imagesrc');
const ctx = canvas.getContext('2d');
canvas.width = 250;
canvas.height = 250;

//-- Gestionar el estado el envío
const state = {
  sendingImage: false,
  totalTime: 0,
  totalPackages:0,
  sendingPackage:0,
  delay: 1,
  delayDefault: 1,
  node: 3,
  nodeDefault: 3,
  loop: null
}

// Audio
const sound_charge = new Audio("clics.mp3");
sound_charge.currentTime = 0;
const sound_end = new Audio("cuak-sound-effect.mp3");
sound_end.currentTime = 0;

//-- Iniciar los valores de los deslizadores con el valor de la 
// variable de estado para el delay y el nodo
gui.delayValue.innerHTML = state.delay;
gui.nodeValue.innerHTML = state.node;

//-- Cuando está disponible cargo la imagen con la nube para represntar el destino
imgCloud.onload = function () {

  //-- Situar la imagen original en el canvas
  //-- No se han hecho manipulaciones todavía
  ctx.drawImage(imgCloud, 75, 75);
}

//-- función de callback para el envío de la imagen
gui.bsend.onclick = () => {
  sendImage()
}

//-- función de callback para actualizar los valores del 
// deslizador y la variable de estado para el delay
gui.delay.oninput = () => {
  gui.delayValue.innerHTML = gui.delay.value;
  state.delay = gui.delay.value;
}

gui.node.oninput = () => {
  gui.nodeValue.innerHTML = gui.node.value;
  state.node = gui.node.value;
}

//-- simulación del envío de la imagen
//-- la he planteado como que cada línea horizontal de la imagen
//-- es un paquete de datos, que sufrirá el retardo correspondiente.
//-- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
const sendImage = () => {

  console.log("Comienzo a enviar...");
 
  //-- Situar la imagen original en el canvas
  //-- No se han hecho manipulaciones todavía
  ctx.globalAlpha = 0.5;
  ctx.drawImage(imgFront, 0, 0);

  //-- Obtener la imagen del canvas en pixeles
  //let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  state.totalPackages = canvas.height;
  state.sendingImage = true;

  //-- declaro las variables fuera del loop
  //-- esta me servirá para seleccionar el rectángulo de la imagen
  let imgData = ctx.getImageData(0, 0, 1, 1)
  
  //-- Obtener el array con todos los píxeles
  let data = imgData.data

  state.loop = setInterval(() => {

    state.totalTime++
    state.sendingPackage++

    //-- dimensiones del rectángulo 1
    sx1 = 0;
    sy1 = 0;
    sw1 = canvas.width;
    sh1 = state.sendingPackage;

    imgData = ctx.getImageData(sx1, sy1, sw1, sh1);

    //-- Obtener el array con todos los píxeles
    data = imgData.data;

    //-- cambiamos el canal del rectángulo que hemos seleccionado
    for (let i = 0; i < data.length; i+=4) {
      data[i+1] = 70;
      data[i+2] = 0;
    }
    
    //-- dimensiones del rectángulo 2
    // sx2 = sx1;
    // sy2 = sh1+1;
    // sw2 = sw1;
    // sh2 = state.totalPackages - sh1;

    // if (sh2 > 0) {
    //   //-- seleccionamos el rectángulo 2
    //   imgData = ctx.getImageData(sx2, sy2, sw2, sh2);

    //   //-- Obtener el array con todos los píxeles
    //   data = imgData.data
  
    //   for (let i = 0; i < data.length; i+=6) {
    //     data[i] = 100;
    //     data[i+1] = 100;
    //     data[i+2] = 200;
    //   }  
    // }

    //-- Poner la imagen modificada en el canvas
    ctx.putImageData(imgData, 0, 0);

    // Paramos el loop si hemos terminado de enviar
    if (state.sendingPackage == state.totalPackages) {
      ctx.globalAlpha = 1;
      ctx.drawImage(imgBack, 0, 0); 
      console.log("Envio terminado...");
      state.sendingImage = false;             
      clearInterval(state.loop);
      sound_charge.pause();
      sound_end.play();
    }

    console.log("Enviando...");
  }, (state.delay * state.node) )

  sound_charge.play();
  sound_charge.loop = true;
}

console.log("Red preparada...");

gui.resend.onclick = () => {
  console.log("RESTART");
  location.reload();
}