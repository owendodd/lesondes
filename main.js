// LES ONDES — Lang switching, email subscribe & typewriter animation

(function () {
    // --- Language switching ---
    let currentLang = localStorage.getItem('lang') || 'en';

    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        document.querySelectorAll('[data-en]').forEach(el => {
            const text = lang === 'fr' && el.dataset.fr ? el.dataset.fr : el.dataset.en;
            if (text !== undefined) el.textContent = text;
        });

        document.getElementById('lang-fr').classList.toggle('active', lang === 'fr');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    }

    document.querySelectorAll('.lang-option').forEach(el => {
        el.addEventListener('click', () => applyLang(el.dataset.lang));
    });

    // Apply lang first so elements have correct text before snapshotting
    applyLang(currentLang);

    // --- Typewriter animation ---

    // Classify each element so we can give it a natural cadence
    function getCtx(el) {
        if (el.closest('.nav-links'))        return 'nav';
        if (el.classList.contains('lang-option')) return 'lang';
        if (el.closest('.title-row'))        return 'title';
        if (el.closest('.dates-row'))        return 'dates';
        if (el.classList.contains('large')) return 'ticket-price';
        if (el.closest('.section-content')) return 'artist';
        if (el.closest('.ticket-option'))   return 'ticket-desc';
        if (el.closest('.subscribe-section')) {
            if (el.id === 'email-display')  return 'email';
            if (el.id === 'subscribe-btn')  return 'subscribe-btn';
            return 'subscribe-label';
        }
        if (el.classList.contains('label')) return 'section-label';
        return 'default';
    }

    // Base char delay per context (ms)
    function charDelay(ctx) {
        switch (ctx) {
            case 'title':        return 38;
            case 'ticket-price': return 30;
            case 'dates':        return 26;
            case 'section-label':return 20;
            case 'nav':          return 16;
            case 'lang':         return 16;
            case 'artist':       return 16;
            case 'ticket-desc':  return 13;
            default:             return 18;
        }
    }

    // Extra pause after a character (punctuation breathing room)
    function extraAfterChar(ch) {
        if (ch === '–' || ch === '—') return 120;
        if (ch === ',')               return 55;
        if (ch === '(' || ch === ')') return 35;
        if (ch === '&')               return 45;
        return 0;
    }

    // Pause between elements based on context transition
    function pauseAfter(ctx, nextCtx) {
        if (!nextCtx) return 0;

        // Within nav / lang
        if (ctx === 'nav'  && nextCtx === 'nav')  return 25;
        if (ctx === 'nav'  && nextCtx === 'lang') return 55;
        if (ctx === 'lang' && nextCtx === 'lang') return 20;

        // Breath before the title
        if ((ctx === 'nav' || ctx === 'lang') && nextCtx === 'title') return 380;

        // Between the two title elements
        if (ctx === 'title' && nextCtx === 'title') return 210;

        // Title → dates
        if (ctx === 'title' && nextCtx === 'dates') return 70;

        // Dates: a slow, deliberate beat
        if (ctx === 'dates' && nextCtx === 'dates') return 120;

        // Long silence after the header
        if (ctx === 'dates' && nextCtx === 'section-label') return 680;

        // Pause before content begins
        if (ctx === 'section-label' && (nextCtx === 'artist' || nextCtx === 'ticket-price')) return 200;

        // Artist list: steady rhythm
        if (ctx === 'artist' && nextCtx === 'artist') return 65;

        // End of a content block → next section
        if (ctx === 'artist' && nextCtx === 'section-label') return 520;

        // Tickets
        if (ctx === 'ticket-price' && nextCtx === 'ticket-desc') return 75;
        if (ctx === 'ticket-desc'  && nextCtx === 'ticket-desc') return 28;
        if (ctx === 'ticket-desc'  && nextCtx === 'ticket-price') return 320;

        // After last ticket description → subscribe
        if (ctx === 'ticket-desc' && (nextCtx === 'subscribe-label' || nextCtx === 'section-label')) return 560;

        // Subscribe
        if (ctx === 'subscribe-label' && nextCtx === 'email')         return 75;
        if (ctx === 'email'           && nextCtx === 'subscribe-btn') return 40;

        return 55; // default
    }

    // Snapshot all content elements
    const elements = Array.from(document.querySelectorAll('#content p, #content a'));
    const texts = elements.map(el => el.textContent);
    elements.forEach(el => el.textContent = '');

    // Build sequential start times
    const startTimes = [];
    let cursor = 0;

    elements.forEach((el, i) => {
        startTimes.push(cursor);
        const ctx     = getCtx(el);
        const delay   = charDelay(ctx);
        const text    = texts[i];

        // Duration: sum of per-character delays including punctuation pauses
        let duration = 0;
        for (const ch of text) {
            duration += delay + extraAfterChar(ch);
        }

        const nextCtx = elements[i + 1] ? getCtx(elements[i + 1]) : null;
        cursor += duration + pauseAfter(ctx, nextCtx);
    });

    // Schedule typing for each element
    elements.forEach((el, i) => {
        setTimeout(() => {
            const text  = texts[i];
            const ctx   = getCtx(el);
            const delay = charDelay(ctx);
            let j = 0;

            function typeChar() {
                if (j >= text.length) return;
                const ch = text[j++];
                el.textContent += ch;
                setTimeout(typeChar, delay + extraAfterChar(ch));
            }

            typeChar();
        }, startTimes[i]);
    });

    // --- Email subscribe ---
    const emailDisplay = document.getElementById('email-display');
    const emailInput   = document.getElementById('email-input');
    const subscribeBtn = document.getElementById('subscribe-btn');
    const brevoForm    = document.getElementById('brevo-form');
    const brevoEmail   = document.getElementById('brevo-email');

    let emailSubmitted = false;

    function updateDisplay() {
        if (!emailDisplay || !emailInput || emailSubmitted) return;
        const val = emailInput.value;
        emailDisplay.textContent = val || (currentLang === 'fr' ? 'Votre email' : 'Your email');
        emailDisplay.classList.toggle('has-value', !!val);
    }

    if (emailDisplay) {
        emailDisplay.addEventListener('click', () => {
            if (!emailSubmitted) emailInput.focus();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', updateDisplay);
        emailInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') submitEmail();
        });
    }

    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', submitEmail);
    }

    function submitEmail() {
        if (!emailInput || !emailInput.value || emailSubmitted) return;
        const email = emailInput.value.trim();
        if (!email || !email.includes('@')) return;

        if (brevoEmail) brevoEmail.value = email;
        if (brevoForm)  brevoForm.submit();

        emailSubmitted = true;
        if (emailDisplay) {
            emailDisplay.textContent = currentLang === 'fr' ? 'Merci !' : 'Thank you!';
            emailDisplay.classList.remove('has-value');
        }
    }
})();
