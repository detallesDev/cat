/**
 * cat.js
 * Módulo responsable del gatito: SVG realista, expresiones y animaciones.
 * No depende de otros módulos.
 */

const Cat = (() => {

    /* --------------------------------------------------
       PALETA DE COLORES DEL GATITO
    -------------------------------------------------- */
    const COLORS = {
        body: '#e8c9a0',   // beige dorado
        bodyDark: '#c9a47a',   // sombra cuerpo
        stripe: '#b8926a',   // rayas tabby
        belly: '#f5e6cc',   // panza más clara
        ear_inner: '#f7c5c5',   // interior oreja
        nose: '#f4a0a0',   // nariz
        eye_bg: '#ffffff',
        pupil: '#2c1810',
        iris_calm: '#7bc67e',   // ojos verdes tranquilo
        iris_happy: '#5eb8ff',   // ojos azules feliz
        iris_scared: '#ff9f43',   // ojos naranja asustado
        iris_smug: '#c77dff',   // ojos violeta burlón
        whisker: '#9e8060',
        mouth: '#c47a6a',
        cheek: 'rgba(255,180,160,0.45)',
    };

    /* --------------------------------------------------
       EXPRESIONES
       Cada una retorna el SVG string del gatito.
    -------------------------------------------------- */

    function buildSVG({ irisColor, pupilShape, eyebrowTilt, mouthPath, earTilt, blush }) {
        return `
<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bodyGrad" cx="50%" cy="45%" r="55%">
      <stop offset="0%"   stop-color="${COLORS.belly}"/>
      <stop offset="100%" stop-color="${COLORS.bodyDark}"/>
    </radialGradient>
    <radialGradient id="bellyGrad" cx="50%" cy="40%" r="55%">
      <stop offset="0%"   stop-color="#fff8ee"/>
      <stop offset="100%" stop-color="${COLORS.belly}"/>
    </radialGradient>
    <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="0.6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- OREJAS traseras -->
  <polygon points="18,38 10,8 34,26" fill="${COLORS.bodyDark}" transform="rotate(${earTilt[0]},18,38)"/>
  <polygon points="82,38 90,8 66,26" fill="${COLORS.bodyDark}" transform="rotate(${earTilt[1]},82,38)"/>
  <!-- Interior orejas -->
  <polygon points="18,36 14,16 30,28" fill="${COLORS.ear_inner}" transform="rotate(${earTilt[0]},18,36)"/>
  <polygon points="82,36 86,16 70,28" fill="${COLORS.ear_inner}" transform="rotate(${earTilt[1]},82,36)"/>

  <!-- CUERPO principal -->
  <ellipse cx="50" cy="70" rx="32" ry="28" fill="url(#bodyGrad)" filter="url(#soft)"/>

  <!-- CABEZA -->
  <ellipse cx="50" cy="46" rx="34" ry="30" fill="url(#bodyGrad)"/>

  <!-- Rayas tabby cabeza -->
  <path d="M30,22 Q50,18 70,22" stroke="${COLORS.stripe}" stroke-width="1.5" fill="none" opacity="0.5"/>
  <path d="M34,16 Q50,12 66,16" stroke="${COLORS.stripe}" stroke-width="1"   fill="none" opacity="0.4"/>
  <path d="M20,38 Q24,34 22,30" stroke="${COLORS.stripe}" stroke-width="1.2" fill="none" opacity="0.4"/>
  <path d="M80,38 Q76,34 78,30" stroke="${COLORS.stripe}" stroke-width="1.2" fill="none" opacity="0.4"/>

  <!-- PANZA -->
  <ellipse cx="50" cy="72" rx="18" ry="16" fill="url(#bellyGrad)" opacity="0.85"/>

  <!-- PATAS delanteras -->
  <ellipse cx="34" cy="94" rx="10" ry="8" fill="${COLORS.bodyDark}" opacity="0.7"/>
  <ellipse cx="66" cy="94" rx="10" ry="8" fill="${COLORS.bodyDark}" opacity="0.7"/>
  <ellipse cx="34" cy="93" rx="9"  ry="7" fill="${COLORS.belly}"/>
  <ellipse cx="66" cy="93" rx="9"  ry="7" fill="${COLORS.belly}"/>
  <!-- Deditos -->
  <ellipse cx="28" cy="96" rx="2.5" ry="2" fill="${COLORS.bodyDark}" opacity="0.5"/>
  <ellipse cx="34" cy="97" rx="2.5" ry="2" fill="${COLORS.bodyDark}" opacity="0.5"/>
  <ellipse cx="40" cy="96" rx="2.5" ry="2" fill="${COLORS.bodyDark}" opacity="0.5"/>
  <ellipse cx="60" cy="96" rx="2.5" ry="2" fill="${COLORS.bodyDark}" opacity="0.5"/>
  <ellipse cx="66" cy="97" rx="2.5" ry="2" fill="${COLORS.bodyDark}" opacity="0.5"/>
  <ellipse cx="72" cy="96" rx="2.5" ry="2" fill="${COLORS.bodyDark}" opacity="0.5"/>

  <!-- COLA -->
  <path d="M82,82 Q106,70 96,54 Q90,42 82,52" stroke="${COLORS.bodyDark}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M82,82 Q104,71 95,56 Q90,45 83,53" stroke="${COLORS.belly}" stroke-width="4" fill="none" stroke-linecap="round"/>

  <!-- OJOS -->
  <!-- Ojo izquierdo -->
  <ellipse cx="36" cy="44" rx="9" ry="9" fill="${COLORS.eye_bg}"/>
  <ellipse cx="36" cy="44" rx="7" ry="7" fill="${irisColor}"/>
  <ellipse cx="36" cy="44" rx="${pupilShape[0]}" ry="5" fill="${COLORS.pupil}"/>
  <circle  cx="33" cy="41" r="1.5" fill="white" opacity="0.8"/>
  <!-- Ojo derecho -->
  <ellipse cx="64" cy="44" rx="9" ry="9" fill="${COLORS.eye_bg}"/>
  <ellipse cx="64" cy="44" rx="7" ry="7" fill="${irisColor}"/>
  <ellipse cx="64" cy="44" rx="${pupilShape[0]}" ry="5" fill="${COLORS.pupil}"/>
  <circle  cx="61" cy="41" r="1.5" fill="white" opacity="0.8"/>
  <!-- Línea superior ojo (párpado) -->
  <path d="M27,41 Q36,37 45,41" stroke="${COLORS.pupil}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M55,41 Q64,37 73,41" stroke="${COLORS.pupil}" stroke-width="1.5" fill="none" stroke-linecap="round"/>

  <!-- CEJAS -->
  <path d="M27,35 Q36,${eyebrowTilt[0]} 45,35" stroke="${COLORS.stripe}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M55,35 Q64,${eyebrowTilt[1]} 73,35" stroke="${COLORS.stripe}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>

  <!-- NARIZ -->
  <path d="M47,55 L50,52 L53,55 Q50,58 47,55Z" fill="${COLORS.nose}"/>
  <!-- Filtrum -->
  <line x1="50" y1="52" x2="50" y2="58" stroke="${COLORS.mouth}" stroke-width="0.8"/>

  <!-- BOCA -->
  <path d="${mouthPath}" stroke="${COLORS.mouth}" stroke-width="1.8" fill="none" stroke-linecap="round"/>

  <!-- BIGOTES -->
  <line x1="12" y1="54" x2="44" y2="57" stroke="${COLORS.whisker}" stroke-width="0.9" opacity="0.7"/>
  <line x1="12" y1="58" x2="44" y2="59" stroke="${COLORS.whisker}" stroke-width="0.9" opacity="0.6"/>
  <line x1="14" y1="62" x2="44" y2="61" stroke="${COLORS.whisker}" stroke-width="0.9" opacity="0.5"/>
  <line x1="88" y1="54" x2="56" y2="57" stroke="${COLORS.whisker}" stroke-width="0.9" opacity="0.7"/>
  <line x1="88" y1="58" x2="56" y2="59" stroke="${COLORS.whisker}" stroke-width="0.9" opacity="0.6"/>
  <line x1="86" y1="62" x2="56" y2="61" stroke="${COLORS.whisker}" stroke-width="0.9" opacity="0.5"/>

  <!-- MEJILLAS (rubor) -->
  ${blush ? `
  <ellipse cx="26" cy="57" rx="8" ry="5" fill="${COLORS.cheek}"/>
  <ellipse cx="74" cy="57" rx="8" ry="5" fill="${COLORS.cheek}"/>
  ` : ''}
</svg>`;
    }

    /* --------------------------------------------------
       DEFINICIÓN DE EXPRESIONES
    -------------------------------------------------- */
    const EXPRESSIONS = {
        calm: () => buildSVG({
            irisColor: COLORS.iris_calm,
            pupilShape: [3, 5],
            eyebrowTilt: [33, 33],
            mouthPath: 'M46,60 Q50,64 54,60',
            earTilt: [0, 0],
            blush: true,
        }),

        happy: () => buildSVG({
            irisColor: COLORS.iris_happy,
            pupilShape: [4, 5],
            eyebrowTilt: [30, 30],
            mouthPath: 'M44,60 Q50,67 56,60',
            earTilt: [-4, 4],
            blush: true,
        }),

        scared: () => buildSVG({
            irisColor: COLORS.iris_scared,
            pupilShape: [5.5, 5],
            eyebrowTilt: [30, 30],
            mouthPath: 'M46,62 Q50,59 54,62',
            earTilt: [6, -6],
            blush: false,
        }),

        smug: () => buildSVG({
            irisColor: COLORS.iris_smug,
            pupilShape: [2, 5],
            eyebrowTilt: [36, 30],
            mouthPath: 'M46,60 Q50,62 56,58',
            earTilt: [-2, 2],
            blush: false,
        }),

        surprised: () => buildSVG({
            irisColor: COLORS.iris_happy,
            pupilShape: [6, 5],
            eyebrowTilt: [27, 27],
            mouthPath: 'M46,60 Q50,65 54,60',
            earTilt: [-6, 6],
            blush: true,
        }),
    };

    /* --------------------------------------------------
       MENSAJES por expresión
    -------------------------------------------------- */
    const MESSAGES = {
        calm: ['Miau~', 'Zzzz...', '...', '¿Qué?', 'Mmm'],
        happy: ['¡Miau! 🥺', '¡Me pillaste!', '¡Uuu!', 'Mrrr 💕', '¡Atrapada!'],
        scared: ['¡Nooo!', '¡Eek!', '😱 ¡Ayy!', '¡Corre!', '¡Pillada!'],
        smug: ['Jaja 😼', '¡No puedes!', 'Pruébalo~', '😏 Miau', 'Lento~'],
        surprised: ['¡Oh!', '¡Sorpresa!', '😲 ¡Miau!', '¡Inesperado!'],
    };

    /* --------------------------------------------------
       API PÚBLICA
    -------------------------------------------------- */
    function getExpression(name) {
        return (EXPRESSIONS[name] || EXPRESSIONS.calm)();
    }

    function getMessage(expressionName) {
        const pool = MESSAGES[expressionName] || MESSAGES.calm;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    /**
     * Elige expresión según el nivel de dificultad y el tiempo restante.
     * @param {number} level        1-5
     * @param {number} timeRatio    0-1 (ratio de tiempo restante del gatito)
     */
    function chooseExpression(level, timeRatio) {
        if (timeRatio < 0.25) return 'smug';      // casi escapado → burlón
        if (timeRatio < 0.5) return 'scared';    // nervioso
        if (level >= 4) return 'surprised'; // nivel alto
        if (level >= 2) return 'calm';
        return 'happy';
    }

    return { getExpression, getMessage, chooseExpression };

})();