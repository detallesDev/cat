/**
 * main.js
 * Punto de entrada: inicializa el juego, conecta botones y eventos globales.
 * Depende de: Cat, UI, Game
 */

(function () {

    /* --------------------------------------------------
       DIFICULTAD SELECCIONADA
    -------------------------------------------------- */
    let selectedDifficulty = 'easy';

    /* --------------------------------------------------
       BOTONES DE DIFICULTAD
    -------------------------------------------------- */
    const diffBtns = document.querySelectorAll('.diff-btn');
    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDifficulty = btn.dataset.diff;
        });
    });

    /* --------------------------------------------------
       BOTÓN JUGAR
    -------------------------------------------------- */
    document.getElementById('btn-start').addEventListener('click', () => {
        Game.startGame(selectedDifficulty);
    });

    /* --------------------------------------------------
       BOTONES DE FIN DE PARTIDA
    -------------------------------------------------- */
    document.getElementById('btn-restart').addEventListener('click', () => {
        Game.startGame(selectedDifficulty);
    });

    document.getElementById('btn-menu').addEventListener('click', () => {
        UI.showScreen('start');
    });

    /* --------------------------------------------------
       PANTALLA INICIAL
    -------------------------------------------------- */
    UI.showScreen('start');

})();