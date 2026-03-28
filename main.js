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
})();
