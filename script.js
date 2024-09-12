const memoryGrid = document.getElementById('memory-grid');
const statusDisplay = document.getElementById('status');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
const gridSizeSelect = document.getElementById('grid-size');

let moves = 0;
let flippedCards = [];
let matches = 0;
let timer;
let timeRemaining = 60;
let isTimerRunning = false;
let cards = [];
const maxCards = 36; // Max number of cards (6x6 = 36)
const imageCount = 23; // Number of images in the pictures folder

document.getElementById('back-to-home').addEventListener('click', function() {
    // Navigate back to the front page
    window.location.href = 'index.html'; // Adjust 'index.html' to your home page file
});

// Load all images
function getImagePaths() {
    const paths = [];
    for (let i = 1; i <= imageCount; i++) {
        paths.push(`pictures/image${i}.jpg`);
    }
    return paths;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createGrid(size) {
    memoryGrid.innerHTML = '';
    let numCards = size * size;

    if (numCards > maxCards) {
        alert('Max cards allowed is 36.');
        return;
    }

    const numIcons = numCards / 2;
    const imagePaths = getImagePaths();
    shuffle(imagePaths);
    cards = [...imagePaths.slice(0, numIcons), ...imagePaths.slice(0, numIcons)];
    shuffle(cards);

    memoryGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    cards.forEach((path) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = path;
        card.innerHTML = `<div class="card-content" style="background-image: url(${path});"></div>`;
        card.addEventListener('click', flipCard);
        memoryGrid.appendChild(card);
    });
}

function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;

    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;
        if (timeRemaining === 0) {
            clearInterval(timer);
            setTimeout(() => alert('Game Over. BOBO!!'), 300);
            restartGame();
        }
    }, 1000);
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    moves++;
    statusDisplay.textContent = `Moves: ${moves} | Time: ${timeRemaining}s`;

    // Display messages based on move count
    if (moves === 5) {
        setTimeout(() => alert('Bagal!, Bilisan mo naman!'), 300);
    } else if (moves === 10) {
        setTimeout(() => alert('Bilis!, Ambagal ampota di kasi nagttraining'), 300);
    } else if (moves === 15) {
        setTimeout(() => alert('Mauubos na oras mo!, Kupal kaba?!'), 300);
    }

    const [card1, card2] = flippedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matches++;
        if (matches === cards.length / 2) {
            clearInterval(timer);
            setTimeout(() => alert('Gana ka maski patal ka!'), 300);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function restartGame() {
    clearInterval(timer);
    isTimerRunning = false;
    timeRemaining = 60;
    timerDisplay.textContent = timeRemaining;
    moves = 0;
    matches = 0;
    flippedCards = [];
    statusDisplay.textContent = `Moves: ${moves} | Time: ${timeRemaining}s`;

    const size = parseInt(gridSizeSelect.value);
    createGrid(size);
    startTimer();
}

startButton.addEventListener('click', () => {
    const size = parseInt(gridSizeSelect.value);
    restartGame(size);
});

restartButton.addEventListener('click', restartGame);
