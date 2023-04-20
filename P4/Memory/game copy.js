const selectors = {
    gridContainer: document.querySelector('.grid-container'),
    board: document.querySelector('.board'),
    movements: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('.start'),
    restart: document.querySelector('.restart'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const pokemons = [
    { name: '1', image: '001.png'},
    { name: '2', image: '004.png'},
    { name: '3', image: '007.png'},
    { name: '4', image: '025.png'},
    { name: '5', image: '039.png'},
    { name: '6', image: '050.png'},
    { name: '7', image: '054.png'},
    { name: '8', image: '105.png'},
    { name: '9', image: '129.png'},
    { name: '10', image: '143.png'},
];

const generateGame = () => {
    var dimensions = selectors.board.getAttribute('grid-dimension');

    if (dimensions % 2 !== 0) {
        throw new Error("Las dimensiones del tablero deben ser un número par.");
    }

    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];
    
    const picks = pickRandom(pokemons, (dimensions * dimensions) / 2);

    const items = shuffle([...picks, ...picks]);
    
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item[i].image}"/></div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html');

    selectors.board.replaceWith(parser.querySelector('.board'));
}

const pickRandom = (array, items) => {

    const clonedArray = [...array];
    const randomPicks = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
}

const shuffle = array => {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];

        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    })
}

const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');

    state.loop = setInterval(() => {
        state.totalTime++;

        selectors.movements.innerText = `Movimientos: ${state.totalFlips}`;
        selectors.timer.innerText = `Tiempo: ${state.totalTime} seg`;
    }, 1000);
}

const stopGame = () => {
    state.gameStarted = false;
    selectors.start.classList.add('enabled');
    state.loop = null;
    clearInterval(state.loop);
}

const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.gridContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    ¡Has ganado!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en un tiempo de <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `;
            // Paramos el loop porque el juego ha terminado
            clearInterval(state.loop);
        }, 1000);
    }
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    })

    state.flippedCards = 0;
}

// Botones
selectors.start.onclick = () => {
    console.log("START");
    startGame();
}

selectors.restart.onclick = () => {
    console.log("RESTART");
    state.gameStarted = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;

    flipBackCards();
    generateGame(dim);

    selectors.start.classList.remove('disabled');
    selectors.movements.innerText = `Movimientos: ${state.totalFlips}`;
    selectors.timer.innerText = `Tiempo: ${state.totalTime} seg`;
    
    clearInterval(state.loop);
}

// Generamos el juego
generateGame();

// Asignamos las funciones de callback para determinados eventos
attachEventListeners();