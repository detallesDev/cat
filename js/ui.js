/**
 * ui.js
 * Módulo de interfaz: partículas, mensajes del HUD, transiciones de pantalla,
 * animaciones de puntaje, banner de racha.
 * Depende de: ningún otro módulo JS (solo manipula el DOM).
 */

const UI = (() => {

    /* --------------------------------------------------
       REFERENCIAS DOM
    -------------------------------------------------- */
    const screens = {
        start: document.getElementById('screen-start'),
        game: document.getElementById('screen-game'),
        end: document.getElementById('screen-end'),
    };

    const elScore = document.getElementById('score');
    const elTimer = document.getElementById('timer');
    const elLevelStars = document.getElementById('level-stars');
    const elCatchBar = document.getElementById('catch-bar');
    const elParticles = document.getElementById('particles');
    const elStreakBanner = document.getElementById('streak-banner');
    const elCatMsg = document.getElementById('cat-msg');

    // End screen
    const elFinalScore = document.getElementById('final-score');
    const elFinalCaught = document.getElementById('final-caught');
    const elFinalBestStreak = document.getElementById('final-best-streak');
    const elEndEmoji = document.getElementById('end-emoji');
    const elEndTitle = document.getElementById('end-title');
    const elEndMsg = document.getElementById('end-msg');

    /* --------------------------------------------------
       TRANSICIONES DE PANTALLA
    -------------------------------------------------- */
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        if (screens[name]) screens[name].classList.add('active');
    }

    /* --------------------------------------------------
       HUD
    -------------------------------------------------- */
    function updateScore(val) {
        elScore.textContent = val;
        elScore.classList.remove('pop');
        void elScore.offsetWidth; // reflow
        elScore.classList.add('pop');
    }

    function updateTimer(val) {
        elTimer.textContent = val;
        if (val <= 5) elTimer.style.color = '#ff4d4d';
        else elTimer.style.color = '';
    }

    function updateLevel(level) {
        const stars = '⭐'.repeat(Math.min(level, 5));
        elLevelStars.textContent = stars || '⭐';
    }

    /* --------------------------------------------------
       BARRA DE TIEMPO DEL GATITO
    -------------------------------------------------- */
    function updateCatchBar(ratio) {
        // ratio: 1 = llena, 0 = vacía
        elCatchBar.style.width = (ratio * 100) + '%';
        if (ratio < 0.3) elCatchBar.classList.add('urgent');
        else elCatchBar.classList.remove('urgent');
    }

    /* --------------------------------------------------
       MENSAJE DEL GATITO
    -------------------------------------------------- */
    let msgTimeout = null;

    function showCatMessage(text, duration = 800) {
        elCatMsg.textContent = text;
        elCatMsg.classList.add('show');
        clearTimeout(msgTimeout);
        msgTimeout = setTimeout(() => elCatMsg.classList.remove('show'), duration);
    }

    /* --------------------------------------------------
       PARTÍCULAS / CORAZONES
    -------------------------------------------------- */
    const CATCH_PARTICLES = ['💕', '✨', '🌸', '⭐', '💖', '🐾'];
    const ESCAPE_PARTICLES = ['😿', '💨', '🌀', '😔'];
    const SPECIAL_PARTICLES = ['🌟', '💛', '👑', '✨', '🎉', '💫'];

    function spawnParticles(x, y, type = 'catch', count = 5) {
        const pool = type === 'catch' ? CATCH_PARTICLES
            : type === 'escape' ? ESCAPE_PARTICLES
                : SPECIAL_PARTICLES;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'particle';
            el.textContent = pool[Math.floor(Math.random() * pool.length)];

            const offsetX = (Math.random() - 0.5) * 80;
            const offsetY = -(Math.random() * 40 + 20);

            el.style.left = (x + offsetX) + 'px';
            el.style.top = y + 'px';
            el.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';
            el.style.animationDuration = (0.7 + Math.random() * 0.5) + 's';
            el.style.animationDelay = (Math.random() * 0.2) + 's';

            elParticles.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
    }

    /* --------------------------------------------------
       BANNER DE RACHA
    -------------------------------------------------- */
    let bannerTimeout = null;

    function showStreakBanner(streak) {
        clearTimeout(bannerTimeout);
        elStreakBanner.classList.remove('hidden');

        const messages = [
            '', '', '',
            `🔥 x${streak} ¡Racha!`,
            `🔥🔥 x${streak} ¡Increíble!`,
            `💥 x${streak} ¡Imparable!`,
            `🌟 x${streak} ¡Leyenda!`,
        ];
        elStreakBanner.textContent = messages[Math.min(streak, messages.length - 1)] || `🔥 x${streak}`;

        bannerTimeout = setTimeout(() => {
            elStreakBanner.classList.add('hidden');
        }, 1800);
    }

    /* --------------------------------------------------
       PANTALLA DE FIN
    -------------------------------------------------- */
    function showEndScreen({ score, caught, bestStreak, level }) {
        elFinalScore.textContent = score;
        elFinalCaught.textContent = caught;
        elFinalBestStreak.textContent = bestStreak;

        // Mensaje y emoji según desempeño
        if (caught === 0) {
            elEndEmoji.textContent = '😸';
            elEndTitle.textContent = '¡Ups!';
            elEndMsg.textContent = '¡El gatito ganó esta vez! Inténtalo de nuevo 🐾';
        } else if (score >= 300) {
            elEndEmoji.textContent = '😻';
            elEndTitle.textContent = '¡Eres una leyenda!';
            elEndMsg.textContent = '¡El gatito está impresionado! 💕';
        } else if (score >= 150) {
            elEndEmoji.textContent = '😺';
            elEndTitle.textContent = '¡Muy bien!';
            elEndMsg.textContent = '¡Casi no puede escaparse de ti! 🌸';
        } else {
            elEndEmoji.textContent = '🐱';
            elEndTitle.textContent = '¡Bien hecho!';
            elEndMsg.textContent = '¡El gatito dice miau! 🐾';
        }

        showScreen('end');
    }

    /* --------------------------------------------------
       FLASHING del área de juego (fallo)
    -------------------------------------------------- */
    function flashMiss() {
        const area = document.getElementById('game-area');
        area.style.transition = 'background 0.15s';
        area.style.background = 'rgba(255,100,100,0.15)';
        setTimeout(() => { area.style.background = ''; }, 300);
    }

    /* --------------------------------------------------
       API PÚBLICA
    -------------------------------------------------- */
    return {
        showScreen,
        updateScore,
        updateTimer,
        updateLevel,
        updateCatchBar,
        showCatMessage,
        spawnParticles,
        showStreakBanner,
        showEndScreen,
        flashMiss,
    };

})();