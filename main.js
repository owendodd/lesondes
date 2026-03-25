// LES ONDES — Lang switching, email subscribe & typewriter animation

// --- WebGL particle background (static) ---
(function () {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const COUNT = 600;

    const vs = `
        attribute vec2 a_pos;
        attribute float a_size;
        uniform vec2 u_res;
        void main() {
            vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
            gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
            gl_PointSize = a_size;
        }
    `;

    const fs = `
        precision mediump float;
        void main() {
            float d = length(vec2(gl_PointCoord.x - 0.5, (gl_PointCoord.y - 0.5) * 2.0));
            float a = 1.0 - smoothstep(0.3, 0.5, d);
            if (a < 0.01) discard;
            gl_FragColor = vec4(0.0, 0.0, 0.0, a);
        }
    `;

    function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const aPos  = gl.getAttribLocation(prog, 'a_pos');
    const aSize = gl.getAttribLocation(prog, 'a_size');
    const uRes  = gl.getUniformLocation(prog, 'u_res');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const posData  = new Float32Array(COUNT * 2);
    const sizeData = new Float32Array(COUNT);

    const posBuf  = gl.createBuffer();
    const sizeBuf = gl.createBuffer();

    function draw() {
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = document.body.scrollHeight;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);

        for (let i = 0; i < COUNT; i++) {
            posData[i * 2]     = Math.random() * w;
            posData[i * 2 + 1] = Math.random() * h;
            const r = Math.random();
            sizeData[i] = 1.8 + r * r * 3.2;
        }

        gl.clearColor(0.96, 0.96, 0.955, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, posData, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
        gl.bufferData(gl.ARRAY_BUFFER, sizeData, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(aSize);
        gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, COUNT);
    }

    draw();
    window.addEventListener('resize', draw);
})();

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

    // Leading and trailing spaces are layout spaces — pre-revealed, never typed
    function layoutSpaceSet(text) {
        const s = new Set();
        let i = 0;
        while (i < text.length && text[i] === ' ') s.add(i++);
        i = text.length - 1;
        while (i >= 0 && text[i] === ' ') s.add(i--);
        return s;
    }

    // Classify each element so we can give it a natural cadence
    function getCtx(el) {
        if (el.closest('.nav-links'))        return 'nav';
        if (el.classList.contains('lang-option')) return 'lang';
        if (el.closest('.title-row'))        return 'title';
        if (el.closest('.dates-row'))        return 'dates';
        // Subscribe-section before 'large' check — email-display and subscribe-btn both have class large
        if (el.closest('.subscribe-section')) {
            if (el.id === 'email-display')  return 'email';
            if (el.id === 'subscribe-btn')  return 'subscribe-btn';
            return 'subscribe-label';
        }
        if (el.classList.contains('large')) return 'ticket-price';
        if (el.closest('.section-content')) return 'artist';
        if (el.closest('.ticket-option'))   return 'ticket-desc';
        if (el.classList.contains('label')) return 'section-label';
        return 'default';
    }

    // Base char delay per context (ms)
    function charDelay(ctx) {
        switch (ctx) {
            case 'title':        return 78;
            case 'ticket-price': return 36;
            case 'dates':        return 34;
            case 'section-label':return 24;
            case 'nav':          return 20;
            case 'lang':         return 20;
            case 'artist':       return 26;
            case 'ticket-desc':  return 16;
            default:             return 22;
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
        if (ctx === 'title' && nextCtx === 'title') return 280;

        // Title → dates
        if (ctx === 'title' && nextCtx === 'dates') return 90;

        // Dates: a slow, deliberate beat
        if (ctx === 'dates' && nextCtx === 'dates') return 120;

        // Within nav / lang
        if (ctx === 'nav'  && nextCtx === 'nav')  return 25;
        if (ctx === 'nav'  && nextCtx === 'lang') return 55;
        if (ctx === 'lang' && nextCtx === 'lang') return 20;

        // Breath before the title
        if ((ctx === 'nav' || ctx === 'lang') && nextCtx === 'title') return 380;

        // Between title elements
        if (ctx === 'title' && nextCtx === 'title') return 280;

        // Title → dates
        if (ctx === 'title' && nextCtx === 'dates') return 90;

        // Dates
        if (ctx === 'dates' && nextCtx === 'dates') return 120;

        // Long pause after header
        if (ctx === 'dates' && nextCtx === 'section-label') return 680;

        // Pause before content begins
        if (ctx === 'section-label' && (nextCtx === 'artist' || nextCtx === 'ticket-price')) return 200;

        // Artist list
        if (ctx === 'artist' && nextCtx === 'artist') return 85;

        // End of section → next section label
        if (ctx === 'artist' && nextCtx === 'section-label') return 520;

        // Tickets
        if (ctx === 'ticket-price' && nextCtx === 'ticket-desc') return 75;
        if (ctx === 'ticket-desc'  && nextCtx === 'ticket-desc') return 28;
        if (ctx === 'ticket-desc'  && nextCtx === 'ticket-price') return 320;

        // Last ticket → subscribe
        if (ctx === 'ticket-desc' && (nextCtx === 'subscribe-label' || nextCtx === 'section-label')) return 560;

        // Subscribe
        if (ctx === 'subscribe-label' && nextCtx === 'email')         return 75;
        if (ctx === 'email'           && nextCtx === 'subscribe-btn') return 40;

        return 55; // default
    }

    // Snapshot nav + header elements only
    const elements = Array.from(document.querySelectorAll(
        '.nav-links a, .lang-option, .title-row p, .dates-row p'
    ));
    const texts = elements.map(el => el.textContent);
    elements.forEach((el, i) => {
        el.innerHTML = '';
        const layout = layoutSpaceSet(texts[i]);
        for (let k = 0; k < texts[i].length; k++) {
            const sp = document.createElement('span');
            sp.textContent = texts[i][k];
            sp.style.visibility = layout.has(k) ? 'visible' : 'hidden';
            el.appendChild(sp);
        }
    });

    // Build sequential start times
    const startTimes = [];
    let cursor = 800; // initial delay before typing starts (ms)

    elements.forEach((el, i) => {
        startTimes.push(cursor);
        const ctx   = getCtx(el);
        const delay = charDelay(ctx);
        const text  = texts[i];

        const layout = layoutSpaceSet(text);
        let duration = 0;
        let k = 0;
        for (const ch of text) {
            if (!layout.has(k)) duration += delay + extraAfterChar(ch);
            k++;
        }

        const nextCtx = elements[i + 1] ? getCtx(elements[i + 1]) : null;
        cursor += duration + pauseAfter(ctx, nextCtx);
    });

    // Schedule typing for each element — reveal spans one by one
    elements.forEach((el, i) => {
        setTimeout(() => {
            const text  = texts[i];
            const ctx   = getCtx(el);
            const delay = charDelay(ctx);
            const spans = el.querySelectorAll('span');
            let j = 0;

            const layout = layoutSpaceSet(text);
            function typeChar() {
                while (j < text.length && layout.has(j)) j++;
                if (j >= text.length) return;
                const ch = text[j];
                spans[j].style.visibility = 'visible';
                j++;
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
    let errorTimeout   = null;

    function btnLabel() {
        return currentLang === 'fr' ? '        S\'inscrire' : '        Subscribe';
    }

    function showError(msg) {
        if (!subscribeBtn) return;
        clearTimeout(errorTimeout);
        subscribeBtn.textContent = '        ' + msg;
        errorTimeout = setTimeout(() => { subscribeBtn.textContent = btnLabel(); }, 2000);
    }

    if (emailInput) {
        emailInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') submitEmail();
        });
        emailInput.addEventListener('input', () => {
            emailInput.classList.toggle('has-value', !!emailInput.value);
        });
        emailInput.addEventListener('focus', () => {
            if (emailDisplay) emailDisplay.classList.add('hidden');
        });
        emailInput.addEventListener('blur', () => {
            if (!emailInput.value && emailDisplay) emailDisplay.classList.remove('hidden');
        });
    }

    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', submitEmail);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function submitEmail() {
        if (!emailInput || emailSubmitted) return;
        const email = emailInput.value.trim();
        if (!email) { showError(currentLang === 'fr' ? 'Entrez votre email' : 'Enter your email'); return; }
        if (!isValidEmail(email)) { showError(currentLang === 'fr' ? 'Email invalide' : 'Invalid email'); return; }

        if (brevoEmail) brevoEmail.value = email;
        if (brevoForm)  brevoForm.submit();

        emailSubmitted = true;
        clearTimeout(errorTimeout);
        emailInput.value = '';
        emailInput.disabled = true;
        emailInput.classList.remove('has-value');
        if (emailDisplay) {
            emailDisplay.textContent = currentLang === 'fr' ? '   Merci !' : '   Thank you!';
            emailDisplay.style.color = 'rgba(0, 0, 0, 0.85)';
            emailDisplay.classList.remove('hidden');
        }
        if (subscribeBtn) { subscribeBtn.style.opacity = '0'; subscribeBtn.style.pointerEvents = 'none'; subscribeBtn.style.cursor = 'default'; }
    }
})();
