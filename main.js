// LES ONDES — Lang switching

(function () {
    let currentLang = localStorage.getItem('lang') || 'en';

    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        document.querySelectorAll('[data-en]').forEach(el => {
            const text = lang === 'fr' && el.dataset.fr ? el.dataset.fr : el.dataset.en;
            if (text !== undefined) el.textContent = text;
        });

        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        document.getElementById('lang-fr').classList.toggle('active', lang === 'fr');
    }

    document.querySelectorAll('.lang-option').forEach(el => {
        el.addEventListener('click', () => applyLang(el.dataset.lang));
    });

    applyLang(currentLang);

    // --- Typewriter animation on header ---

    const elements = Array.from(document.querySelectorAll('#header-title, #header-location, #header-dates'));
    const texts = elements.map(el => el.textContent);
    const charDelay = 60;
    const pauseAfter = [280, 180];

    elements.forEach((el, i) => {
        el.innerHTML = '';
        for (let k = 0; k < texts[i].length; k++) {
            const sp = document.createElement('span');
            sp.textContent = texts[i][k];
            sp.style.visibility = 'hidden';
            el.appendChild(sp);
        }
    });

    let cursor = 400;
    const startTimes = [];

    elements.forEach((el, i) => {
        startTimes.push(cursor);
        cursor += texts[i].length * charDelay + (pauseAfter[i] || 0);
    });

    elements.forEach((el, i) => {
        setTimeout(() => {
            const spans = el.querySelectorAll('span');
            let j = 0;
            function typeChar() {
                if (j >= spans.length) return;
                spans[j].style.visibility = 'visible';
                j++;
                setTimeout(typeChar, charDelay);
            }
            typeChar();
        }, startTimes[i]);
    });
})();
