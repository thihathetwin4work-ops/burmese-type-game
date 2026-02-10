const container = document.getElementById('game-container');
const input = document.getElementById('word-input');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

let score = 0;
let lives = 3;
let isGameOver = false;

async function startGame() {
    const response = await fetch('/api/words');
    const words = await response.json();
    let i = 0;
    setInterval(() => {
        if (!isGameOver) {
            createWord(words[i % words.length]);
            i++;
        }
    }, 2500);
}

function createWord(text) {
    const el = document.createElement('div');
    el.className = 'falling-word';
    el.innerText = text;
    el.style.left = Math.random() * 70 + 5 + '%';
    container.appendChild(el);

    let top = 0;
    const fall = setInterval(() => {
        if (isGameOver) { clearInterval(fall); el.remove(); return; }
        top += 1.5;
        el.style.top = top + 'px';
        if (top > container.offsetHeight - 40) {
            clearInterval(fall);
            el.remove();
            lives--;
            livesEl.innerText = lives;
            if (lives <= 0) endGame();
        }
    }, 20);

    input.addEventListener('input', () => {
        if (input.value.trim() === el.innerText) {
            score += 10;
            scoreEl.innerText = score;
            input.value = '';
            clearInterval(fall);
            el.remove();
        }
    });
}

function endGame() {
    isGameOver = true;
    input.disabled = true;
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').innerText = score;
}

startGame();
