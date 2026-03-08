// LES ONDES — Particle text with ripple displacement
// HTML text drives layout (CSS vw scaling), canvas samples DOM positions for particles

(function () {
    const canvas = document.getElementById('textCanvas');
    const ctx = canvas.getContext('2d');
    const content = document.getElementById('content');

    // Ripple config
    const FORCE = 180;
    const RIPPLE_SPEED = 140;
    const RIPPLE_WIDTH = 55;
    const RIPPLE_LIFE = 3.5;
    const SPAWN_DIST = 40;

    let dpr, width, height;
    let particles = [];
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };
    const ripples = [];

    const SPRING = 0.025;
    const DAMPING = 0.82;
    // Responsive particle density — denser at smaller breakpoints
    function getParticleSize() {
        if (width <= 480) return 1;
        if (width <= 768) return 1.5;
        return 2.1;
    }
    function getSpacing() {
        if (width <= 480) return 1.2;
        if (width <= 768) return 2;
        return 3.2;
    }
    const DRIFT_STRENGTH = 0.3;
    const AUTO_RIPPLE_INTERVAL = 0.6;
    const AUTO_RIPPLE_FORCE = 250;
    let autoRippleTimer = 0;

    class Particle {
        constructor(x, y) {
            this.originX = x;
            this.originY = y;
            this.x = x + (Math.random() - 0.5) * 4;
            this.y = y + (Math.random() - 0.5) * 4;
            this.vx = 0;
            this.vy = 0;
            this.driftPhase = Math.random() * Math.PI * 2;
            this.driftSpeedX = 0.3 + Math.random() * 0.5;
            this.driftSpeedY = 0.4 + Math.random() * 0.5;
            this.driftAmpX = 0.8 + Math.random() * 1.2;
            this.driftAmpY = 0.6 + Math.random() * 1.0;
            this.radius = getParticleSize() * (0.8 + Math.random() * 0.4);
        }

        update(rippleWidth, rippleLife, time) {
            const dx_drift = Math.sin(time * this.driftSpeedX + this.driftPhase) * this.driftAmpX * DRIFT_STRENGTH;
            const dy_drift = Math.cos(time * this.driftSpeedY + this.driftPhase * 1.3) * this.driftAmpY * DRIFT_STRENGTH;

            for (let i = 0; i < ripples.length; i++) {
                const r = ripples[i];
                const dx = this.originX - r.x;
                const dy = this.originY - r.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const waveDist = Math.abs(dist - r.radius);

                if (waveDist < rippleWidth) {
                    const waveFactor = 1 - waveDist / rippleWidth;
                    const ageFactor = 1 - r.age / rippleLife;
                    const strength = waveFactor * ageFactor * r.force * 0.0004;
                    if (dist > 0) {
                        this.vx += (dx / dist) * strength;
                        this.vy += (dy / dist) * strength;
                    }
                }
            }

            this.vx += (this.originX + dx_drift - this.x) * SPRING;
            this.vy += (this.originY + dy_drift - this.y) * SPRING;
            this.vx *= DAMPING;
            this.vy *= DAMPING;
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    // Get visual lines from a DOM element using the Range API
    function getVisualLines(el) {
        const text = el.textContent;
        if (!text.length) return [];

        const range = document.createRange();
        const textNode = el.firstChild;
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return [];

        const lines = [];
        let lineTop = null;
        let lineStart = 0;

        for (let i = 0; i <= text.length; i++) {
            range.setStart(textNode, Math.min(i, text.length));
            range.setEnd(textNode, Math.min(i, text.length));
            const rect = range.getBoundingClientRect();

            if (lineTop === null) {
                lineTop = rect.top;
            } else if (i === text.length || Math.abs(rect.top - lineTop) > 2) {
                // New line detected or end of text
                lines.push({
                    text: text.slice(lineStart, i).trim(),
                    charStart: lineStart,
                    charEnd: i,
                });
                lineStart = i;
                lineTop = rect.top;
            }
        }

        return lines;
    }

    // Sample particles by reading DOM element positions and drawing text on offscreen canvas
    function sampleText(spacing) {
        const off = document.createElement('canvas');
        off.width = width;
        off.height = height;
        const offCtx = off.getContext('2d', { willReadFrequently: true });

        offCtx.fillStyle = '#fff';
        offCtx.textBaseline = 'middle';

        const contentRect = content.getBoundingClientRect();
        const elements = content.querySelectorAll('p');

        elements.forEach(el => {
            const style = getComputedStyle(el);
            const fs = parseFloat(style.fontSize);
            const fw = style.fontWeight;
            const kern = -0.04 * fs;
            const elRect = el.getBoundingClientRect();
            const elLeft = elRect.left - contentRect.left;
            const elW = elRect.width;

            offCtx.font = `${fw} ${fs}px ABCROMCondensed, Helvetica, Arial, sans-serif`;

            // Get each visual line within this element
            const visualLines = getVisualLines(el);

            visualLines.forEach(line => {
                if (!line.text.length) return;

                // Get the vertical center of this visual line using Range
                const range = document.createRange();
                const textNode = el.firstChild;
                range.setStart(textNode, line.charStart);
                range.setEnd(textNode, line.charEnd);
                const lineRect = range.getBoundingClientRect();
                const centerY = lineRect.top - contentRect.top + lineRect.height / 2;

                // Measure line width with kerning
                let totalWidth = 0;
                for (let i = 0; i < line.text.length; i++) {
                    totalWidth += offCtx.measureText(line.text[i]).width;
                }
                totalWidth += kern * (line.text.length - 1);

                // Calculate x based on text-align
                let cx;
                if (style.textAlign === 'center') {
                    cx = elLeft + (elW - totalWidth) / 2;
                } else if (style.textAlign === 'right') {
                    cx = elLeft + elW - totalWidth;
                } else {
                    cx = elLeft;
                }

                // Draw character by character with kerning
                for (let i = 0; i < line.text.length; i++) {
                    const charWidth = offCtx.measureText(line.text[i]).width;
                    offCtx.fillText(line.text[i], cx, centerY);
                    cx += charWidth + kern;
                }
            });
        });

        // Sample particles from the offscreen canvas
        const imageData = offCtx.getImageData(0, 0, width, height).data;
        const gap = Math.max(1, Math.round(spacing));
        const pts = [];

        for (let y = 0; y < height; y += gap) {
            for (let x = 0; x < width; x += gap) {
                if (imageData[(y * width + x) * 4 + 3] > 128) {
                    pts.push(new Particle(x, y));
                }
            }
        }
        return pts;
    }

    function resize() {
        dpr = window.devicePixelRatio || 1;
        const rect = content.getBoundingClientRect();
        width = Math.ceil(rect.width);
        height = Math.ceil(rect.height);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        particles = sampleText(getSpacing());
    }

    function spawnRipple(x, y, force) {
        ripples.push({ x, y, radius: 0, age: 0, force: force || FORCE });
    }

    function handleMove(x, y) {
        mouse.x = x;
        mouse.y = y;
        const dx = mouse.x - mouse.prevX;
        const dy = mouse.y - mouse.prevY;
        if (dx * dx + dy * dy > SPAWN_DIST * SPAWN_DIST) {
            spawnRipple(mouse.x, mouse.y);
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;
        }
    }

    let startTime = 0;
    let lastTime = 0;

    function draw(timestamp) {
        if (!startTime) startTime = timestamp;
        if (!lastTime) lastTime = timestamp;
        const dt = (timestamp - lastTime) * 0.001;
        lastTime = timestamp;
        const time = (timestamp - startTime) * 0.001;

        // Auto ripple sweep
        autoRippleTimer += dt;
        if (autoRippleTimer >= AUTO_RIPPLE_INTERVAL) {
            autoRippleTimer = 0;
            const cycleTime = 12;
            const t = (time % cycleTime) / cycleTime;
            const sweep = t < 0.5 ? t * 2 : 2 - t * 2;
            const sx = width * (1 - sweep);
            const sy = height * sweep;
            spawnRipple(sx, sy, AUTO_RIPPLE_FORCE);
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].radius += RIPPLE_SPEED * dt;
            ripples[i].age += dt;
            if (ripples[i].age > RIPPLE_LIFE) {
                ripples.splice(i, 1);
            }
        }

        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#000';

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update(RIPPLE_WIDTH, RIPPLE_LIFE, time);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        requestAnimationFrame(draw);
    }

    // Mouse/touch handlers — offset by scroll and canvas position
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        handleMove(e.clientX - rect.left, e.clientY - rect.top);
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        handleMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }, { passive: false });
    canvas.addEventListener('touchend', () => { mouse.x = mouse.y = -9999; });

    // Language toggle
    let currentLang = 'en';
    document.getElementById('lang-toggle').addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (!btn || btn.dataset.lang === currentLang) return;

        currentLang = btn.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.documentElement.lang = currentLang;

        // Update all translatable text
        content.querySelectorAll('p[data-' + currentLang + ']').forEach(el => {
            el.textContent = el.getAttribute('data-' + currentLang);
        });

        // Re-sample particles for new text
        resize();
    });

    // Wait for font load, then init
    document.fonts.ready.then(() => {
        resize();
        new ResizeObserver(resize).observe(content);
        requestAnimationFrame(draw);
    });
})();
