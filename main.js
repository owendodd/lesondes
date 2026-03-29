// LES ONDES — main.js

// Offset page content below fixed header
(function () {
    function setHeaderOffset() {
        const header = document.querySelector('.site-header');
        if (!header) return;
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }
    setHeaderOffset();
    window.addEventListener('resize', setHeaderOffset);
})();

// Lang switching
(function () {
    let currentLang = localStorage.getItem('lang') || 'en';

    function initNewsletter() {
        const newsletterInput = document.getElementById('newsletter-email-input');
        const newsletterSubmit = document.getElementById('newsletter-submit');
        const brevoEmail = document.getElementById('brevo-email');
        const brevoForm = document.getElementById('brevo-form');

        if (!newsletterSubmit) return;

        const messages = {
            empty:   { en: 'Add your email', fr: 'Ajoutez votre email' },
            invalid: { en: 'Invalid email', fr: 'Email invalide' },
            success: { en: 'Thank you!', fr: 'Merci\u00a0!' },
        };
        const submitDefault = { en: 'Subscribe', fr: "S'inscrire" };
        let errorTimer = null;

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function flashError(key) {
            const lang = currentLang;
            newsletterSubmit.textContent = messages[key][lang];
            newsletterSubmit.style.textDecoration = 'none';
            clearTimeout(errorTimer);
            errorTimer = setTimeout(() => {
                newsletterSubmit.textContent = submitDefault[lang];
                newsletterSubmit.style.textDecoration = '';
            }, 3000);
        }

        newsletterInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') newsletterSubmit.click();
        });

        newsletterSubmit.addEventListener('click', () => {
            const email = newsletterInput.value.trim();
            const lang = currentLang;

            if (!email) { flashError('empty'); newsletterInput.focus(); return; }
            if (!isValidEmail(email)) { flashError('invalid'); newsletterInput.focus(); return; }

            brevoEmail.value = email;
            brevoForm.submit();

            newsletterInput.value = '';
            newsletterInput.placeholder = messages.success[lang];
            newsletterInput.dataset.subscribed = 'true';
            newsletterInput.blur();
            newsletterInput.disabled = true;
            newsletterSubmit.disabled = true;
            newsletterSubmit.style.opacity = '0';
            newsletterSubmit.style.pointerEvents = 'none';
        });
    }

    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        document.querySelectorAll('[data-en]').forEach(el => {
            const text = lang === 'fr' && el.dataset.fr ? el.dataset.fr : el.dataset.en;
            if (text !== undefined) el.textContent = text;
        });

        const input = document.getElementById('newsletter-email-input');
        if (input && !input.dataset.subscribed) {
            input.placeholder = lang === 'fr' ? input.dataset.frPlaceholder : input.dataset.enPlaceholder;
        }

        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        document.getElementById('lang-fr').classList.toggle('active', lang === 'fr');
    }

    document.querySelectorAll('.lang-option').forEach(el => {
        el.addEventListener('click', () => applyLang(el.dataset.lang));
    });

    applyLang(currentLang);

    initNewsletter();

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
