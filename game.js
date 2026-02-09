const container = document.getElementById('game-container');
const input = document.getElementById('word-input');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

let score = 0;
let lives = 3;
let isGameOver = false;

// 1. Fetch Words from Python Backend
async function startGame() {
    const response = await fetch('/api/words');
    const words = await response.json();
    
    let i = 0;
    const spawnTimer = setInterval(() => {
        if (isGameOver) {
            clearInterval(spawnTimer);
            return;
        }
        createWord(words[i % words.length]);
        i++;
    }, 2500); // New word every 2.5 seconds
}

// 2. Create and Animate Word
function createWord(text) {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'falling-word';
    wordDiv.innerText = text;
    wordDiv.style.left = Math.random() * 70 + 5 + '%';
    container.appendChild(wordDiv);

    let top = 0;
    const speed = 1.2 + (score / 100); // Speed increases as you score
    
    const fallInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(fallInterval);
            wordDiv.remove();
            return;
        }

        top += speed;
        wordDiv.style.top = top + 'px';

        // Check if word hit the bottom
        if (top > container.offsetHeight - 40) {
            clearInterval(fallInterval);
            wordDiv.remove();
            loseLife();
        }
    }, 20);

    // 3. Check for matching input
    input.addEventListener('input', (e) => {
        if (input.value.trim() === wordDiv.innerText) {
            clearInterval(fallInterval);
            wordDiv.remove();
            input.value = '';
            updateScore();
        }
    });
}

function updateScore() {
    score += 10;
    scoreEl.innerText = score;
}

function loseLife() {
    lives--;
    livesEl.innerText = lives;
    if (lives <= 0) {
        isGameOver = true;
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('final-score').innerText = score;
        input.disabled = true;
    }
}

startGame();