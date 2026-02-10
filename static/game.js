let selectedLevel = null;

// LEVEL SELECTION
function selectLevel(lvl) {
    selectedLevel = lvl;
    const btns = document.querySelectorAll('.lvl-btn');
    btns.forEach(b => b.classList.remove('active'));
    
    // Highlight selected button
    event.currentTarget.classList.add('active');
    
    // Enable Start Button
    const startBtn = document.getElementById('start-btn');
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
}

const gameEngine = {
    score: 0,
    lives: 3,
    active: false,
    isPaused: false,
    wordsProcessed: 0,
    totalLevelWords: 0,

    async start() {
        if (!selectedLevel) return;

        // UI Transition
        document.getElementById('menu-screen').style.display = 'none';
        document.getElementById('game-interface').style.display = 'block';
        
        this.active = true;

        // Fetch Words
        try {
            const res = await fetch(`/api/words/${selectedLevel}`);
            const words = await res.json();
            this.totalLevelWords = words.length;
            this.wordsProcessed = 0;
            
            document.getElementById('word-input').focus();
            this.runGameLoop(words);
        } catch (e) {
            console.error("Fetch Error:", e);
            alert("Backend error! Ensure app.py is running on port 5001.");
        }
    },

    togglePause() {
        if (!this.active) return;
        this.isPaused = !this.isPaused;
        document.getElementById('pause-modal').style.display = this.isPaused ? 'block' : 'none';
        document.getElementById('pause-trigger').innerText = this.isPaused ? "▶ RESUME" : "⏸ PAUSE";
        if (!this.isPaused) document.getElementById('word-input').focus();
    },

    runGameLoop(words) {
        let i = 0;
        const spawner = setInterval(() => {
            if (!this.active) { clearInterval(spawner); return; }
            if (this.isPaused) return;

            if (i < words.length) {
                this.spawnWord(words[i]);
                i++;
            }
        }, 2800); // Time between word spawns
    },

    spawnWord(text) {
        const area = document.getElementById('play-area');
        const el = document.createElement('div');
        el.className = 'falling-word';
        el.innerText = text;
        el.style.left = Math.random() * 70 + 10 + '%';
        el.style.top = '0px';
        area.appendChild(el);

        let top = 0;
        const speed = 0.7; // VERY SLOW

        const fallInterval = setInterval(() => {
            if (!this.active) { clearInterval(fallInterval); el.remove(); return; }
            if (this.isPaused) return;

            top += speed;
            el.style.top = top + 'px';

            if (top > 370) {
                clearInterval(fallInterval);
                el.remove();
                this.handleCompletion(false);
            }
        }, 20);

        // Listen for typing
        const input = document.getElementById('word-input');
        const checkMatch = () => {
            if (this.isPaused) return;
            if (input.value.trim() === el.innerText) {
                this.score += 10;
                document.getElementById('score').innerText = this.score;
                input.value = '';
                clearInterval(fallInterval);
                el.remove();
                this.handleCompletion(true);
                input.removeEventListener('input', checkMatch);
            }
        };
        input.addEventListener('input', checkMatch);
    },

    handleCompletion(success) {
        if (!success) {
            this.lives--;
            document.getElementById('lives').innerText = this.lives;
            if (this.lives <= 0) {
                this.active = false;
                alert("Game Over! Score: " + this.score);
                location.reload();
                return;
            }
        }

        this.wordsProcessed++;
        if (this.wordsProcessed >= this.totalLevelWords) {
            this.active = false;
            document.getElementById('congrats-modal').style.display = 'block';
            document.getElementById('final-score-display').innerText = "Total Score: " + this.score;
        }
    }
};
