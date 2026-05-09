/**
 * game.js
 * Lógica principal del juego: estado, niveles, temporizador, posicionamiento.
 * Depende de: Cat, UI
 */

const Game = (() => {

    /* --------------------------------------------------
       CONFIGURACIÓN POR DIFICULTAD
    -------------------------------------------------- */
    const DIFFICULTY = {
        easy: { gameDuration: 40, catchWindow: 3.5, baseScore: 10, speedMult: 0.7 },
        normal: { gameDuration: 30, catchWindow: 2.5, baseScore: 15, speedMult: 1.0 },
        hard: { gameDuration: 25, catchWindow: 1.6, baseScore: 22, speedMult: 1.4 },
    };

    /* --------------------------------------------------
       ESTADO DEL JUEGO
    -------------------------------------------------- */
    let state = {
        running: false,
        score: 0,
        caught: 0,
        missed: 0,
        streak: 0,
        bestStreak: 0,
        level: 1,
        gameTimeLeft: 30,
        catchTimeLeft: 2.5,
        catchWindow: 2.5,
        difficulty: 'normal',
        expression: 'calm',
    };

    // Timers internos
    let gameTimer = null;
    let catchTimer = null;
    let catchBarRAF = null;

    // Referencia al DOM del gatito
    const catEl = document.getElementById('cat');
    const catFaceEl = document.getElementById('cat-face');
    const gameArea = document.getElementById('game-area');

    /* --------------------------------------------------
       POSICIONAMIENTO
    -------------------------------------------------- */
    function randomPosition() {
        const area = gameArea.getBoundingClientRect();
        // Lee el tamaño del gatito desde la CSS custom property para ser fiel al breakpoint activo
        const cssSize = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--cat-size'), 10
        ) || 80;
        const catW = catEl.offsetWidth || cssSize;
        const catH = catEl.offsetHeight || cssSize;
        const margin = 16;

        const maxX = area.width - catW - margin;
        const maxY = area.height - catH - margin;

        return {
            x: margin + Math.random() * maxX,
            y: margin + Math.random() * maxY,
        };
    }

    function placeCat() {
        const pos = randomPosition();
        catEl.style.left = pos.x + 'px';
        catEl.style.top = pos.y + 'px';
    }

    /* --------------------------------------------------
       EXPRESIÓN DINÁMICA (cambia con tiempo restante)
    -------------------------------------------------- */
    function updateExpression() {
        const ratio = state.catchTimeLeft / state.catchWindow;
        const expr = Cat.chooseExpression(state.level, ratio);
        if (expr !== state.expression) {
            state.expression = expr;
            catFaceEl.innerHTML = Cat.getExpression(expr);
        }
    }

    /* --------------------------------------------------
       MOSTRAR GATITO
    -------------------------------------------------- */
    function showCat() {
        if (!state.running) return;

        // Elegir expresión inicial según nivel
        state.expression = state.level >= 3 ? 'scared' : 'calm';
        catFaceEl.innerHTML = Cat.getExpression(state.expression);

        placeCat();

        catEl.classList.remove('hidden', 'caught', 'escaped');
        void catEl.offsetWidth;
        catEl.classList.add('visible');

        // Resetear barra
        state.catchTimeLeft = state.catchWindow;
        UI.updateCatchBar(1);

        // Iniciar countdown de captura
        startCatchCountdown();
    }

    /* --------------------------------------------------
       COUNTDOWN DE CAPTURA (barra del gatito)
    -------------------------------------------------- */
    function startCatchCountdown() {
        clearInterval(catchTimer);
        const interval = 80; // ms
        const totalSteps = (state.catchWindow * 1000) / interval;
        let step = 0;

        catchTimer = setInterval(() => {
            if (!state.running) { clearInterval(catchTimer); return; }

            step++;
            state.catchTimeLeft = state.catchWindow - (step * interval / 1000);
            const ratio = Math.max(0, state.catchTimeLeft / state.catchWindow);

            UI.updateCatchBar(ratio);
            updateExpression();

            if (ratio <= 0) {
                clearInterval(catchTimer);
                catEscaped();
            }
        }, interval);
    }

    /* --------------------------------------------------
       GATITO CAPTURADO
    -------------------------------------------------- */
    function catCaught(event) {
        if (!state.running) return;
        if (catEl.classList.contains('hidden')) return;

        clearInterval(catchTimer);

        // Posición del clic para partículas
        const area = gameArea.getBoundingClientRect();
        const px = event.clientX - area.left;
        const py = event.clientY - area.top;

        // Calcular puntos: más rápido = más puntos
        const timeRatio = state.catchTimeLeft / state.catchWindow;
        const diff = DIFFICULTY[state.difficulty];
        const bonusMult = 1 + timeRatio;                       // 1x–2x
        const streakMult = 1 + (state.streak * 0.1);            // racha bonus
        const points = Math.round(diff.baseScore * state.level * bonusMult * streakMult);

        state.score += points;
        state.caught += 1;
        state.streak += 1;
        if (state.streak > state.bestStreak) state.bestStreak = state.streak;

        // Mensaje
        const msg = Cat.getMessage(state.expression);
        UI.showCatMessage(msg);
        UI.updateScore(state.score);

        // Partículas
        const particleType = state.streak >= 5 ? 'special' : 'catch';
        UI.spawnParticles(px, py, particleType, state.streak >= 3 ? 7 : 5);

        // Racha
        if (state.streak >= 3) UI.showStreakBanner(state.streak);

        // Animación de captura
        catEl.classList.remove('visible');
        catEl.classList.add('caught');

        // Nivel
        updateLevel();

        catEl.addEventListener('animationend', () => {
            catEl.classList.add('hidden');
            catEl.classList.remove('caught');
            // Siguiente gatito con pequeña pausa
            const pause = 300 + Math.random() * 400;
            setTimeout(showCat, pause);
        }, { once: true });
    }

    /* --------------------------------------------------
       GATITO ESCAPÓ
    -------------------------------------------------- */
    function catEscaped() {
        if (!state.running) return;

        state.missed += 1;
        state.streak = 0;

        UI.showCatMessage(Cat.getMessage('smug'), 900);
        UI.flashMiss();

        catEl.classList.remove('visible');
        catEl.classList.add('escaped');

        catEl.addEventListener('animationend', () => {
            catEl.classList.add('hidden');
            catEl.classList.remove('escaped');
            const pause = 400 + Math.random() * 500;
            setTimeout(showCat, pause);
        }, { once: true });
    }

    /* --------------------------------------------------
       NIVEL
    -------------------------------------------------- */
    function updateLevel() {
        // Sube nivel cada 5 capturas
        const newLevel = Math.min(5, 1 + Math.floor(state.caught / 5));
        if (newLevel !== state.level) {
            state.level = newLevel;
            // Reducir un poco la ventana de captura al subir nivel
            state.catchWindow = DIFFICULTY[state.difficulty].catchWindow * (1 - (state.level - 1) * 0.12);
            UI.updateLevel(state.level);
        }
    }

    /* --------------------------------------------------
       TEMPORIZADOR GLOBAL
    -------------------------------------------------- */
    function startGameTimer() {
        clearInterval(gameTimer);
        gameTimer = setInterval(() => {
            if (!state.running) { clearInterval(gameTimer); return; }

            state.gameTimeLeft--;
            UI.updateTimer(state.gameTimeLeft);

            if (state.gameTimeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    /* --------------------------------------------------
       INICIO / FIN
    -------------------------------------------------- */
    function startGame(difficulty = 'normal') {
        const diff = DIFFICULTY[difficulty] || DIFFICULTY.normal;

        state = {
            running: true,
            score: 0,
            caught: 0,
            missed: 0,
            streak: 0,
            bestStreak: 0,
            level: 1,
            gameTimeLeft: diff.gameDuration,
            catchTimeLeft: diff.catchWindow,
            catchWindow: diff.catchWindow,
            difficulty,
            expression: 'calm',
        };

        UI.updateScore(0);
        UI.updateTimer(diff.gameDuration);
        UI.updateLevel(1);
        UI.updateCatchBar(1);
        UI.showScreen('game');

        startGameTimer();

        // Primer gatito con pequeña demora
        setTimeout(showCat, 600);
    }

    function endGame() {
        state.running = false;
        clearInterval(gameTimer);
        clearInterval(catchTimer);

        // Ocultar gatito si está visible
        catEl.classList.add('hidden');
        catEl.classList.remove('visible', 'caught', 'escaped');

        setTimeout(() => {
            UI.showEndScreen({
                score: state.score,
                caught: state.caught,
                bestStreak: state.bestStreak,
                level: state.level,
            });
        }, 500);
    }

    /* --------------------------------------------------
       EVENTOS DEL GATITO
    -------------------------------------------------- */
    catEl.addEventListener('click', catCaught);
    catEl.addEventListener('touchstart', (e) => {
        e.preventDefault();
        catCaught(e.touches[0]);
    }, { passive: false });

    /* --------------------------------------------------
       API PÚBLICA
    -------------------------------------------------- */
    return {
        startGame,
        endGame,
        getState: () => ({ ...state }),
    };

})();