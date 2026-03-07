// LES ONDES — Particle text with ripple displacement

(function () {
    const canvas = document.getElementById('textCanvas');
    const ctx = canvas.getContext('2d');

    // Fixed config
    const FORCE = 180;
    const RIPPLE_SPEED = 140;
    const RIPPLE_WIDTH = 55;
    const RIPPLE_LIFE = 3.5;
    const SPAWN_DIST = 40;

    let dpr, width, height, fontSize;
    let particles = [];
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };
    const ripples = [];

    const SPRING = 0.025;
    const DAMPING = 0.82;
    const PARTICLE_SIZE = 2.8;
    const SPACING = 1.5;
    const DRIFT_STRENGTH = 0.3;
    const AUTO_RIPPLE_INTERVAL = 0.6; // seconds between auto ripples
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
            this.radius = PARTICLE_SIZE * (0.8 + Math.random() * 0.4);
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

    function sampleText(spacing) {
        const off = document.createElement('canvas');
        off.width = width;
        off.height = height;
        const offCtx = off.getContext('2d', { willReadFrequently: true });

        offCtx.textBaseline = 'middle';
        offCtx.fillStyle = '#fff';

        const lineGap = fontSize * -0.1;
        const kerning = -0.06 * fontSize;
        const font = `bold ${fontSize}px ABCPelikan, Helvetica, Arial, sans-serif`;
        const fontItalic = `italic bold ${fontSize}px ABCPelikan, Helvetica, Arial, sans-serif`;

        function drawKernedText(text, cy, italic) {
            offCtx.font = italic ? fontItalic : font;
            let totalWidth = 0;
            for (let i = 0; i < text.length; i++) {
                totalWidth += offCtx.measureText(text[i]).width;
            }
            totalWidth += kerning * (text.length - 1);
            let cx = (width - totalWidth) / 2;
            for (let i = 0; i < text.length; i++) {
                const charWidth = offCtx.measureText(text[i]).width;
                offCtx.fillText(text[i], cx, cy);
                cx += charWidth + kerning;
            }
        }

        const isMobile = width <= 768;
        const lines = isMobile
            ? ['LES', 'ONDES', 'MAY', '29 30 31', 'CER', 'BÈRE']
            : ['LES ONDES', 'MAY 29 30 31', 'CERBÈRE'];

        const totalHeight = fontSize * lines.length + lineGap * (lines.length - 1);
        const topY = (height - totalHeight) / 2 + fontSize / 2;

        for (let l = 0; l < lines.length; l++) {
            drawKernedText(lines[l], topY + (fontSize + lineGap) * l);
        }

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
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        fontSize = width <= 768 ? 128 : 256;
        particles = sampleText(SPACING);
    }

    function spawnRipple(x, y, force) {
        ripples.push({ x, y, radius: 0, age: 0, force: force || FORCE });
    }

    function handleMove(x, y) {
        mouse.x = x;
        mouse.y = y;
        const dx = mouse.x - mouse.prevX;
        const dy = mouse.y - mouse.prevY;
        const spawnDist = SPAWN_DIST;
        if (dx * dx + dy * dy > spawnDist * spawnDist) {
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

        const rippleSpeed = RIPPLE_SPEED;
        const rippleWidth = RIPPLE_WIDTH;
        const rippleLife = RIPPLE_LIFE;

        // Auto ripple: sweep right-to-left then back over 12s (6s each way)
        autoRippleTimer += dt;
        if (autoRippleTimer >= AUTO_RIPPLE_INTERVAL) {
            autoRippleTimer = 0;
            const cycleTime = 12;
            const t = (time % cycleTime) / cycleTime;
            // Triangle wave: 0→1→0 over one cycle
            const sweep = t < 0.5 ? t * 2 : 2 - t * 2;
            // Sweep from right to left (1→0) then back
            const sx = width * (1 - sweep);
            const sy = height * 0.5;
            spawnRipple(sx, sy, AUTO_RIPPLE_FORCE);
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].radius += rippleSpeed * dt;
            ripples[i].age += dt;
            if (ripples[i].age > rippleLife) {
                ripples.splice(i, 1);
            }
        }

        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#000';

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update(rippleWidth, rippleLife, time);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener('touchend', () => { mouse.x = mouse.y = -9999; });

    // Wait for custom font to load before sampling text
    document.fonts.ready.then(() => {
        resize();
        new ResizeObserver(resize).observe(document.documentElement);
        requestAnimationFrame(draw);
    });
})();
