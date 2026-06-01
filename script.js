const board = document.querySelector('.board');
const blockSize = 50;
const startButton = document.querySelector('.btn-start');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');
const modal = document.querySelector('.modal');
const scoreEl = document.querySelector('#score');
const highScoreEl = document.querySelector('#high-score');
const timeEl = document.querySelector('#time');

const blocks = [];
let snake = [{ x: 1, y: 3 }];
let direction = "left";
let intervalId = null;
let timerId = null;
let score = 0;
let seconds = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;

const cols = Math.floor(board.clientWidth / blockSize);
const rows = Math.floor(board.clientHeight / blockSize);
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

highScoreEl.textContent = highScore;

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row},${col}`] = block;
    }
}

blocks[`${food.x},${food.y}`].classList.add("food");

function startTimer() {
    timerId = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        timeEl.textContent = `${m}:${s}`;
    }, 1000);
}

function render() {
    let head;
    if (direction === "left")       head = { x: snake[0].x,     y: snake[0].y - 1 };
    else if (direction === "right") head = { x: snake[0].x,     y: snake[0].y + 1 };
    else if (direction === "up")    head = { x: snake[0].x - 1, y: snake[0].y     };
    else                            head = { x: snake[0].x + 1, y: snake[0].y     };

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols || snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(intervalId);
        clearInterval(timerId);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreEl.textContent = highScore;
        }
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    snake.forEach(seg => blocks[`${seg.x},${seg.y}`].classList.remove("fill"));

    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x},${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        blocks[`${food.x},${food.y}`].classList.add("food");
        snake.unshift(head);
        score++;
        scoreEl.textContent = score;
    } else {
        snake.unshift(head);
        snake.pop();
    }

    snake.forEach(seg => blocks[`${seg.x},${seg.y}`].classList.add("fill"));
}

startButton.addEventListener('click', () => {
    modal.style.display = "none";
    startTimer();
    intervalId = setInterval(render, 300);
});

restartButton.addEventListener('click', () => {
    snake.forEach(seg => blocks[`${seg.x},${seg.y}`].classList.remove("fill"));
    blocks[`${food.x},${food.y}`].classList.remove("food");

    snake = [{ x: 1, y: 3 }];
    direction = "left";
    score = 0;
    seconds = 0;
    scoreEl.textContent = 0;
    timeEl.textContent = "00:00";
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    blocks[`${food.x},${food.y}`].classList.add("food");

    modal.style.display = "none";
    gameOverModal.style.display = "none";

    clearInterval(intervalId);
    clearInterval(timerId);
    startTimer();
    intervalId = setInterval(render, 300);
});

addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':  if (direction !== "right") direction = "left";  break;
        case 'ArrowRight': if (direction !== "left")  direction = "right"; break;
        case 'ArrowUp':    if (direction !== "down")  direction = "up";    break;
        case 'ArrowDown':  if (direction !== "up")    direction = "down";  break;
    }
});