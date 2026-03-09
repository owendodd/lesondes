// LES ONDES — True particle rendering with CPU wave simulation
// Text → offscreen canvas → scan pixels → generate particles → GL_POINTS with wave displacement

(function () {
    const canvas = document.getElementById('textCanvas');
    const content = document.getElementById('content');

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) { console.error('WebGL not supported'); return; }

    // --- Particle shaders ---
    const particleVS = `
        attribute vec2 a_position; // pixel coords
        attribute float a_gray;
        varying float v_gray;
        uniform vec2 u_resolution;
        uniform sampler2D u_waveField;
        uniform vec2 u_waveTexel;
        uniform float u_displaceStrength;
        uniform float u_pointSize;

        void main() {
            v_gray = a_gray;
            vec2 uv = a_position / u_resolution;
            // Sample wave gradient for displacement
            float wL = texture2D(u_waveField, uv + vec2(-u_waveTexel.x, 0.0)).r - 0.5;
            float wR = texture2D(u_waveField, uv + vec2( u_waveTexel.x, 0.0)).r - 0.5;
            float wU = texture2D(u_waveField, uv + vec2(0.0,  u_waveTexel.y)).r - 0.5;
            float wD = texture2D(u_waveField, uv + vec2(0.0, -u_waveTexel.y)).r - 0.5;
            vec2 displacement = vec2(wR - wL, wU - wD) * u_displaceStrength;

            vec2 pos = a_position + displacement;
            // Convert to clip space: (0,0) top-left → (-1,1), (w,h) bottom-right → (1,-1)
            vec2 clip = (pos / u_resolution) * 2.0 - 1.0;
            clip.y = -clip.y;
            gl_Position = vec4(clip, 0.0, 1.0);
            gl_PointSize = u_pointSize;
        }
    `;

    const particleFS = `
        precision highp float;
        varying float v_gray;
        void main() {
            // Perfect circle: discard outside radius
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            if (dist > 0.5) discard;
            gl_FragColor = vec4(v_gray, v_gray, v_gray, 0.9);
        }
    `;

    // --- Background shader (clear to bg color) ---
    const bgVS = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;
    const bgFS = `
        precision highp float;
        uniform vec3 u_bgColor;
        void main() {
            gl_FragColor = vec4(u_bgColor, 1.0);
        }
    `;

    // --- Compile shaders ---
    function compileShader(src, type) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    function createProgram(vsSrc, fsSrc) {
        const vs = compileShader(vsSrc, gl.VERTEX_SHADER);
        const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(prog));
            return null;
        }
        return prog;
    }

    const particleProg = createProgram(particleVS, particleFS);
    const bgProg = createProgram(bgVS, bgFS);

    // Particle program uniforms
    const pu = {
        position: gl.getAttribLocation(particleProg, 'a_position'),
        gray: gl.getAttribLocation(particleProg, 'a_gray'),
        resolution: gl.getUniformLocation(particleProg, 'u_resolution'),
        waveField: gl.getUniformLocation(particleProg, 'u_waveField'),
        waveTexel: gl.getUniformLocation(particleProg, 'u_waveTexel'),
        displaceStrength: gl.getUniformLocation(particleProg, 'u_displaceStrength'),
        pointSize: gl.getUniformLocation(particleProg, 'u_pointSize'),
    };

    // Background program
    const bu = {
        position: gl.getAttribLocation(bgProg, 'a_position'),
        bgColor: gl.getUniformLocation(bgProg, 'u_bgColor'),
    };

    // Fullscreen quad for bg
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  1, -1,  -1, 1,
        -1,  1,  1, -1,   1, 1,
    ]), gl.STATIC_DRAW);

    // Particle position buffer
    const particleBuf = gl.createBuffer();
    let particleCount = 0;

    // --- Wave texture ---
    const waveTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, waveTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // --- Tunable parameters ---
    const params = {
        spacing:      { value: 5,    min: 1,    max: 12,   step: 0.5,  label: 'Particle Spacing' },
        pointSize:    { value: 7.6,  min: 0.5,  max: 20,   step: 0.1,  label: 'Particle Size' },
        threshold:    { value: 194,  min: 1,    max: 255,  step: 1,    label: 'Alpha Threshold' },
        jitter:       { value: 3.4,  min: 0,    max: 5,    step: 0.1,  label: 'Position Jitter' },
        waveSpeed:    { value: 0.35, min: 0.05, max: 1.0,  step: 0.05, label: 'Wave Speed' },
        waveDamping:  { value: 0.974, min: 0.8,  max: 1.0,  step: 0.001, label: 'Wave Damping' },
        displaceStr:  { value: 29,   min: 0,    max: 150,  step: 1,    label: 'Displace Strength' },
        pokeRadius:   { value: 3,    min: 2,    max: 30,   step: 1,    label: 'Poke Radius' },
        pokeForce:    { value: 0.25, min: 0.05, max: 2.0,  step: 0.05, label: 'Poke Force' },
        pokeDelay:    { value: 270,  min: 0,    max: 800,  step: 10,   label: 'Poke Delay (ms)' },
    };

    // --- Tuning panel UI ---
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.85);color:#fff;' +
        'padding:12px 16px;font-family:monospace;font-size:11px;z-index:999;max-height:90vh;overflow-y:auto;width:280px;display:none;';

    const configOutput = document.createElement('pre');
    configOutput.style.cssText = 'margin:8px 0 0;padding:8px;background:rgba(255,255,255,0.1);font-size:10px;' +
        'white-space:pre-wrap;word-break:break-all;cursor:pointer;user-select:all;';
    configOutput.title = 'Click to select all';
    configOutput.addEventListener('click', () => {
        const range = document.createRange();
        range.selectNodeContents(configOutput);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    });

    function updateConfigOutput() {
        const cfg = {};
        for (const key in params) cfg[key] = params[key].value;
        configOutput.textContent = JSON.stringify(cfg);
    }

    for (const key in params) {
        const p = params[key];
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:6px;margin:4px 0;';

        const label = document.createElement('span');
        label.style.cssText = 'flex:0 0 130px;';
        label.textContent = p.label;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = p.min;
        slider.max = p.max;
        slider.step = p.step;
        slider.value = p.value;
        slider.style.cssText = 'flex:1;';

        const valDisplay = document.createElement('span');
        valDisplay.style.cssText = 'flex:0 0 45px;text-align:right;';
        valDisplay.textContent = p.value;

        slider.addEventListener('input', () => {
            p.value = parseFloat(slider.value);
            valDisplay.textContent = p.value;
            updateConfigOutput();
            if (key === 'spacing' || key === 'threshold' || key === 'jitter') {
                generateParticles();
            }
        });

        row.appendChild(label);
        row.appendChild(slider);
        row.appendChild(valDisplay);
        panel.appendChild(row);
    }

    panel.appendChild(configOutput);
    updateConfigOutput();
    // --- Draggable panel ---
    const dragHandle = document.createElement('div');
    dragHandle.style.cssText = 'cursor:grab;padding:4px 0 8px;font-weight:bold;text-align:center;user-select:none;';
    dragHandle.textContent = '⋮⋮ drag ⋮⋮';
    panel.insertBefore(dragHandle, panel.firstChild);

    let dragOffset = { x: 0, y: 0 };
    let dragging = false;
    dragHandle.addEventListener('mousedown', (e) => {
        dragging = true;
        dragHandle.style.cursor = 'grabbing';
        const rect = panel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        panel.style.left = (e.clientX - dragOffset.x) + 'px';
        panel.style.top = (e.clientY - dragOffset.y) + 'px';
        panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => {
        dragging = false;
        dragHandle.style.cursor = 'grab';
    });

    document.body.appendChild(panel);

    // --- Displacement modes ---
    const MODES = ['wave', 'decay', 'diffusion', 'spring'];
    let currentMode = 'wave';

    // Mode toggle UI
    const modeRow = document.createElement('div');
    modeRow.style.cssText = 'display:flex;gap:4px;margin:8px 0;flex-wrap:wrap;';
    const modeLabel = document.createElement('div');
    modeLabel.textContent = 'Displacement Mode:';
    modeLabel.style.cssText = 'margin-bottom:4px;font-weight:bold;';
    const modeContainer = document.createElement('div');
    modeContainer.style.cssText = 'margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:8px;';
    modeContainer.appendChild(modeLabel);

    const modeBtns = {};
    MODES.forEach(mode => {
        const btn = document.createElement('button');
        btn.textContent = mode;
        btn.style.cssText = 'padding:4px 10px;background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);' +
            'cursor:pointer;font-family:monospace;font-size:11px;text-transform:capitalize;';
        btn.addEventListener('click', () => {
            currentMode = mode;
            updateModeButtons();
            initFields();
        });
        modeBtns[mode] = btn;
        modeRow.appendChild(btn);
    });
    modeContainer.appendChild(modeRow);
    panel.insertBefore(modeContainer, panel.children[1]); // after drag handle

    function updateModeButtons() {
        MODES.forEach(m => {
            modeBtns[m].style.background = m === currentMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)';
            modeBtns[m].style.color = m === currentMode ? '#000' : '#fff';
        });
    }
    updateModeButtons();

    // --- CPU displacement simulation ---
    const WAVE_SCALE = 10;

    let waveW, waveH;
    let waveH0, waveH1;   // wave mode: current + previous; spring mode: position + velocity
    let wavePixels;

    function initFields() {
        const size = waveW * waveH;
        waveH0 = new Float32Array(size);
        waveH1 = new Float32Array(size);
        wavePixels = new Uint8Array(size * 4);
        for (let i = 0; i < size; i++) {
            const pi = i * 4;
            wavePixels[pi] = 128;
            wavePixels[pi + 1] = 0;
            wavePixels[pi + 2] = 0;
            wavePixels[pi + 3] = 255;
        }
        gl.bindTexture(gl.TEXTURE_2D, waveTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, waveW, waveH, 0, gl.RGBA, gl.UNSIGNED_BYTE, wavePixels);
    }

    // Wave: Störmer-Verlet wave equation with absorbing boundaries
    function stepWave_wave() {
        const w = waveW, h = waveH;
        const cur = waveH0, prev = waveH1;
        const spd = params.waveSpeed.value * params.waveSpeed.value;
        const damp = params.waveDamping.value;
        // Absorbing boundary zone width
        const border = Math.max(5, Math.floor(Math.min(w, h) * 0.05));
        for (let y = 1; y < h - 1; y++) {
            const row = y * w;
            for (let x = 1; x < w - 1; x++) {
                const i = row + x;
                const c = cur[i];
                const laplacian = cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w] - 4.0 * c;
                // Extra damping near edges to absorb reflections
                const edgeDist = Math.min(x, w - 1 - x, y, h - 1 - y);
                const edgeDamp = edgeDist < border ? damp * (edgeDist / border) : damp;
                prev[i] = (2.0 * c - prev[i] + spd * laplacian) * edgeDamp;
            }
        }
        waveH0 = prev;
        waveH1 = cur;
    }

    // Decay: bumps fade exponentially, no propagation
    function stepWave_decay() {
        const damp = params.waveDamping.value;
        const n = waveW * waveH;
        for (let i = 0; i < n; i++) {
            waveH0[i] *= damp;
        }
    }

    // Diffusion: heat equation — displacement spreads outward and dissolves
    function stepWave_diffusion() {
        const w = waveW, h = waveH;
        const cur = waveH0;
        const spd = params.waveSpeed.value * 0.25;
        const damp = params.waveDamping.value;
        // Use waveH1 as scratch buffer
        const next = waveH1;
        for (let y = 1; y < h - 1; y++) {
            const row = y * w;
            for (let x = 1; x < w - 1; x++) {
                const i = row + x;
                const laplacian = cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w] - 4.0 * cur[i];
                next[i] = (cur[i] + spd * laplacian) * damp;
            }
        }
        // Swap
        waveH0 = next;
        waveH1 = cur;
    }

    // Spring: each cell is an independent damped harmonic oscillator
    // waveH0 = position, waveH1 = velocity
    function stepWave_spring() {
        const pos = waveH0, vel = waveH1;
        const k = params.waveSpeed.value * 0.5;  // spring stiffness
        const damp = params.waveDamping.value;
        const n = waveW * waveH;
        for (let i = 0; i < n; i++) {
            vel[i] += -k * pos[i];
            vel[i] *= damp;
            pos[i] += vel[i];
        }
    }

    function stepWave() {
        switch (currentMode) {
            case 'wave':     stepWave_wave(); break;
            case 'decay':    stepWave_decay(); break;
            case 'diffusion': stepWave_diffusion(); break;
            case 'spring':   stepWave_spring(); break;
        }
    }

    function pokeWave(normX, normY, force) {
        const cx = Math.floor(normX * waveW);
        const cy = Math.floor(normY * waveH);
        const radius = params.pokeRadius.value;
        const r2 = radius * radius;
        const invR2 = 1.0 / r2;
        const x0 = Math.max(0, cx - radius);
        const x1 = Math.min(waveW - 1, cx + radius);
        const y0 = Math.max(0, cy - radius);
        const y1 = Math.min(waveH - 1, cy + radius);
        for (let y = y0; y <= y1; y++) {
            const dy = y - cy;
            const dy2 = dy * dy;
            const row = y * waveW;
            for (let x = x0; x <= x1; x++) {
                const dx = x - cx;
                const d2 = dx * dx + dy2;
                if (d2 > r2) continue;
                waveH0[row + x] += force * (1.0 - d2 * invR2);
            }
        }
    }

    function uploadWaveTexture() {
        const n = waveW * waveH;
        const px = wavePixels;
        const h = waveH0;
        for (let i = 0; i < n; i++) {
            const v = (h[i] + 0.5) * 255;
            px[i * 4] = v < 0 ? 0 : v > 255 ? 255 : v;
        }
        gl.bindTexture(gl.TEXTURE_2D, waveTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, waveW, waveH, gl.RGBA, gl.UNSIGNED_BYTE, px);
    }

    // --- State ---
    let width, height;

    // --- Text rendering to offscreen 2D canvas ---
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

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
                lines.push({ text: text.slice(lineStart, i).trim(), charStart: lineStart, charEnd: i });
                lineStart = i;
                lineTop = rect.top;
            }
        }
        return lines;
    }

    function drawElementText(ctx2d, el, contentRect, color) {
        const style = getComputedStyle(el);
        const fs = parseFloat(style.fontSize);
        const fw = style.fontWeight;
        const kern = -0.04 * fs;
        const elRect = el.getBoundingClientRect();
        const elLeft = elRect.left - contentRect.left;
        const elW = elRect.width;
        ctx2d.font = `${fw} ${fs}px ABCROMCondensed, Helvetica, Arial, sans-serif`;
        ctx2d.fillStyle = color;
        ctx2d.globalAlpha = 1;
        const visualLines = getVisualLines(el);
        visualLines.forEach(line => {
            if (!line.text.length) return;
            const range = document.createRange();
            const textNode = el.firstChild;
            range.setStart(textNode, line.charStart);
            range.setEnd(textNode, line.charEnd);
            const lineRect = range.getBoundingClientRect();
            const centerY = lineRect.top - contentRect.top + lineRect.height / 2;
            let totalWidth = 0;
            for (let i = 0; i < line.text.length; i++) {
                totalWidth += ctx2d.measureText(line.text[i]).width;
            }
            totalWidth += kern * (line.text.length - 1);
            let cx;
            if (style.textAlign === 'center') {
                cx = elLeft + (elW - totalWidth) / 2;
            } else if (style.textAlign === 'right' || style.textAlign === 'end') {
                cx = elLeft + elW - totalWidth;
            } else {
                cx = elLeft;
            }
            for (let i = 0; i < line.text.length; i++) {
                const charWidth = ctx2d.measureText(line.text[i]).width;
                ctx2d.fillText(line.text[i], cx, centerY);
                cx += charWidth + kern;
            }
        });
        ctx2d.globalAlpha = 1;
    }

    let subscribeHovered = false;
    let subscribeFade = 0; // 0 = black, 1 = gray
    let subscribeFadeTimer = null;

    function animateSubscribeFade() {
        const target = subscribeHovered ? 1 : 0;
        const speed = 0.25;
        subscribeFade += (target - subscribeFade) * speed;
        if (Math.abs(subscribeFade - target) < 0.01) {
            subscribeFade = target;
            renderAndGenerate();
            subscribeFadeTimer = null;
            return;
        }
        renderAndGenerate();
        subscribeFadeTimer = requestAnimationFrame(animateSubscribeFade);
    }

    function startSubscribeFade() {
        if (!subscribeFadeTimer) {
            subscribeFadeTimer = requestAnimationFrame(animateSubscribeFade);
        }
    }

    function getAlphaOverrides() {
        const overrides = {};
        overrides[currentLang === 'en' ? 'lang-fr' : 'lang-en'] = '#999';
        if (!emailSubmitted) {
            const hasValue = emailInput && emailInput.value;
            if (emailFocused && !hasValue) {
                overrides['email-display'] = '#999';
            } else if (!hasValue) {
                overrides['email-display'] = '#999';
            }
        }
        if (subscribeFade > 0.01) {
            const g = Math.round(subscribeFade * 153); // 0 → 153 (#999)
            overrides['subscribe-btn'] = `rgb(${g},${g},${g})`;
        }
        return overrides;
    }

    let cursorVisible = false;
    let cursorBlinkTimer = null;
    let emailFocused = false;

    function startCursorBlink() {
        stopCursorBlink();
        cursorVisible = true;
        cursorBlinkTimer = setInterval(() => {
            cursorVisible = !cursorVisible;
            renderAndGenerate();
        }, 530);
        renderAndGenerate();
    }

    function stopCursorBlink() {
        if (cursorBlinkTimer) {
            clearInterval(cursorBlinkTimer);
            cursorBlinkTimer = null;
        }
        cursorVisible = false;
    }

    function renderTextToCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const contentRect = content.getBoundingClientRect();
        const alphaOverrides = getAlphaOverrides();

        offscreen.width = width;
        offscreen.height = height;
        offCtx.clearRect(0, 0, width, height);
        offCtx.scale(dpr, dpr);
        offCtx.textBaseline = 'middle';

        content.querySelectorAll('p').forEach(el => {
            const color = el.id in alphaOverrides ? alphaOverrides[el.id] : '#000';
            drawElementText(offCtx, el, contentRect, color);
        });

        // Draw blinking cursor for email input
        if (emailFocused && cursorVisible && !emailSubmitted) {
            const emailEl = document.getElementById('email-display');
            if (emailEl) {
                const style = getComputedStyle(emailEl);
                const fs = parseFloat(style.fontSize);
                const elRect = emailEl.getBoundingClientRect();
                const elLeft = elRect.left - contentRect.left;
                const centerY = elRect.top - contentRect.top + elRect.height / 2;
                const hasValue = emailInput && emailInput.value;
                let cursorX;
                if (hasValue) {
                    const kern = -0.04 * fs;
                    offCtx.font = `${style.fontWeight} ${fs}px ABCROMCondensed, Helvetica, Arial, sans-serif`;
                    const text = emailEl.textContent;
                    let textWidth = 0;
                    for (let i = 0; i < text.length; i++) {
                        textWidth += offCtx.measureText(text[i]).width;
                    }
                    textWidth += kern * (text.length - 1);
                    cursorX = elLeft + textWidth + fs * 0.05;
                } else {
                    cursorX = elLeft;
                }
                const cursorH = fs * 0.75;
                offCtx.globalAlpha = 1;
                offCtx.fillRect(cursorX, centerY - cursorH / 2, fs * 0.06, cursorH);
            }
        }
    }

    // --- Particle generation from text pixels ---
    // Simple seeded PRNG for deterministic jitter
    function seededRandom(x, y) {
        let h = (x * 374761393 + y * 668265263 + 1013904223) | 0;
        h = ((h ^ (h >> 13)) * 1274126177) | 0;
        return ((h ^ (h >> 16)) >>> 0) / 4294967296;
    }

    function generateParticles() {
        const imageData = offCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const spacing = Math.max(1, Math.round(params.spacing.value));
        const threshold = params.threshold.value;
        const jitter = params.jitter.value;
        const verts = []; // x, y, gray per particle

        for (let y = 0; y < height; y += spacing) {
            for (let x = 0; x < width; x += spacing) {
                const i = (y * width + x) * 4;
                const alpha = data[i + 3];
                if (alpha >= threshold) {
                    let px = x + 0.5;
                    let py = y + 0.5;
                    if (jitter > 0) {
                        px += (seededRandom(x, y) - 0.5) * jitter * 2;
                        py += (seededRandom(y, x) - 0.5) * jitter * 2;
                    }
                    verts.push(px, py, data[i] / 255); // R channel as gray
                }
            }
        }

        particleCount = verts.length / 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, particleBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
    }

    function renderAndGenerate() {
        renderTextToCanvas();
        generateParticles();
    }

    // --- Resize ---
    // Responsive particle settings
    const mobileParams = {
        spacing: 3.5, pointSize: 5.7, threshold: 50, jitter: 2.6,
        waveSpeed: 0.45, waveDamping: 0.965, displaceStr: 29,
        pokeRadius: 3, pokeForce: 0.25, pokeDelay: 270
    };
    const desktopParams = {
        spacing: 5, pointSize: 7.6, threshold: 194, jitter: 3.4,
        waveSpeed: 0.35, waveDamping: 0.974, displaceStr: 29,
        pokeRadius: 3, pokeForce: 0.25, pokeDelay: 270
    };

    function applyResponsiveParams(cssW) {
        const src = cssW <= 768 ? mobileParams : desktopParams;
        for (const key in src) {
            if (key in params) params[key].value = src[key];
        }
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = content.getBoundingClientRect();
        const cssW = Math.ceil(rect.width);
        const cssH = Math.ceil(rect.height);
        width = Math.ceil(cssW * dpr);
        height = Math.ceil(cssH * dpr);

        applyResponsiveParams(cssW);

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';

        waveW = Math.max(2, Math.ceil(width / WAVE_SCALE));
        waveH = Math.max(2, Math.ceil(height / WAVE_SCALE));
        initFields();

        renderAndGenerate();
    }

    // --- Hit detection ---
    function getHit(canvasX, canvasY) {
        const canvasRect = canvas.getBoundingClientRect();
        const pageX = canvasX + canvasRect.left;
        const pageY = canvasY + canvasRect.top;

        const langEls = content.querySelectorAll('.lang-option');
        for (const el of langEls) {
            const r = el.getBoundingClientRect();
            if (pageX >= r.left && pageX <= r.right && pageY >= r.top && pageY <= r.bottom) {
                return { type: 'lang', lang: el.dataset.lang };
            }
        }

        const emailEl = document.getElementById('email-display');
        if (emailEl) {
            const r = emailEl.getBoundingClientRect();
            if (pageX >= r.left && pageX <= r.right && pageY >= r.top && pageY <= r.bottom) {
                return { type: 'email' };
            }
        }

        const subBtn = document.getElementById('subscribe-btn');
        if (subBtn) {
            const r = subBtn.getBoundingClientRect();
            if (pageX >= r.left && pageX <= r.right && pageY >= r.top && pageY <= r.bottom) {
                return { type: 'subscribe' };
            }
        }
        return null;
    }

    // --- Mouse/touch poke state ---
    const mouse = { x: -1, y: -1 };
    // Smoothed position that lerps toward actual mouse
    const smoothMouse = { x: -1, y: -1 };
    let mouseActive = false;

    function handleMove(cssX, cssY) {
        mouse.x = cssX;
        mouse.y = cssY;
        if (!mouseActive) {
            smoothMouse.x = cssX;
            smoothMouse.y = cssY;
            mouseActive = true;
        }
    }

    let lastPokeX = -1, lastPokeY = -1;
    const POKE_MIN_DIST = 8;
    let pokeQueue = [];

    function updateSmoothedPoke() {
        if (!mouseActive || mouse.x < 0) return;
        const lerp = 0.04;
        smoothMouse.x += (mouse.x - smoothMouse.x) * lerp;
        smoothMouse.y += (mouse.y - smoothMouse.y) * lerp;
        const dx = smoothMouse.x - lastPokeX;
        const dy = smoothMouse.y - lastPokeY;
        if (lastPokeX < 0 || dx * dx + dy * dy > POKE_MIN_DIST * POKE_MIN_DIST) {
            const rect = canvas.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                pokeQueue.push({
                    x: smoothMouse.x / rect.width,
                    y: smoothMouse.y / rect.height,
                    at: performance.now() + params.pokeDelay.value,
                });
                lastPokeX = smoothMouse.x;
                lastPokeY = smoothMouse.y;
            }
        }
    }

    function processPokeQueue() {
        const now = performance.now();
        while (pokeQueue.length && pokeQueue[0].at <= now) {
            const p = pokeQueue.shift();
            pokeWave(p.x, p.y, params.pokeForce.value);
        }
    }

    // --- Animation loop ---
    function draw() {
        updateSmoothedPoke();
        processPokeQueue();
        stepWave();
        uploadWaveTexture();

        gl.viewport(0, 0, width, height);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Draw background
        gl.useProgram(bgProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.enableVertexAttribArray(bu.position);
        gl.vertexAttribPointer(bu.position, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3f(bu.bgColor, 0.863, 0.863, 0.863);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Draw particles
        if (particleCount > 0) {
            gl.useProgram(particleProg);

            gl.bindBuffer(gl.ARRAY_BUFFER, particleBuf);
            gl.enableVertexAttribArray(pu.position);
            gl.vertexAttribPointer(pu.position, 2, gl.FLOAT, false, 12, 0);
            gl.enableVertexAttribArray(pu.gray);
            gl.vertexAttribPointer(pu.gray, 1, gl.FLOAT, false, 12, 8);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, waveTexture);
            gl.uniform1i(pu.waveField, 0);

            gl.uniform2f(pu.resolution, width, height);
            gl.uniform2f(pu.waveTexel, 1.0 / waveW, 1.0 / waveH);
            gl.uniform1f(pu.displaceStrength, params.displaceStr.value);
            gl.uniform1f(pu.pointSize, params.pointSize.value);


            gl.drawArrays(gl.POINTS, 0, particleCount);
        }

        requestAnimationFrame(draw);
    }

    // --- Mouse/touch handlers ---
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const cssX = e.clientX - rect.left;
        const cssY = e.clientY - rect.top;
        handleMove(cssX, cssY);
        const hit = getHit(cssX, cssY);
        canvas.style.cursor = hit ? 'pointer' : '';
        const wasHovered = subscribeHovered;
        subscribeHovered = hit && hit.type === 'subscribe';
        if (subscribeHovered !== wasHovered) startSubscribeFade();
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = mouse.y = -1;
        mouseActive = false;
        lastPokeX = lastPokeY = -1;
        canvas.style.cursor = '';
        if (subscribeHovered) { subscribeHovered = false; startSubscribeFade(); }
    });
    canvas.addEventListener('touchstart', (e) => {
        const rect = canvas.getBoundingClientRect();
        const nx = (e.touches[0].clientX - rect.left) / rect.width;
        const ny = (e.touches[0].clientY - rect.top) / rect.height;
        if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
            pokeWave(nx, ny, params.pokeForce.value);
        }
    }, { passive: true });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const hit = getHit(e.clientX - rect.left, e.clientY - rect.top);
        if (!hit) return;
        if (hit.type === 'lang' && hit.lang !== currentLang) {
            switchLang(hit.lang);
        } else if (hit.type === 'email') {
            emailInput.focus();
        } else if (hit.type === 'subscribe') {
            if (emailInput.value.trim()) {
                submitEmail();
            } else {
                emailInput.focus();
            }
        }
    });

    // --- Language ---
    let currentLang = 'en';

    function switchLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        content.querySelectorAll('p[data-' + lang + ']').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });
        if (!emailInput.value && !emailSubmitted) {
            emailDisplay.textContent = placeholders[lang];
        }
        resize();
    }

    // --- Email form ---
    const emailInput = document.getElementById('email-input');
    const emailDisplay = document.getElementById('email-display');
    let emailSubmitted = false;
    let retextureTimer = null;

    const placeholders = { en: 'Enter your email...', fr: 'Entrez votre email...' };
    const confirmations = { en: 'Thank you!', fr: 'Merci!' };

    function scheduleRetexture() {
        clearTimeout(retextureTimer);
        retextureTimer = setTimeout(() => renderAndGenerate(), 50);
    }

    emailInput.addEventListener('input', () => {
        if (emailSubmitted) return;
        emailDisplay.textContent = emailInput.value || placeholders[currentLang];
        if (emailFocused) startCursorBlink();
        else scheduleRetexture();
    });

    emailInput.addEventListener('focus', () => {
        if (emailSubmitted) return;
        emailFocused = true;
        if (!emailInput.value) emailDisplay.textContent = '\u00A0';
        startCursorBlink();
    });

    emailInput.addEventListener('blur', () => {
        emailFocused = false;
        stopCursorBlink();
        if (emailSubmitted) return;
        if (!emailInput.value) emailDisplay.textContent = placeholders[currentLang];
        renderAndGenerate();
    });

    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); submitEmail(); }
    });

    function submitEmail() {
        const email = emailInput.value.trim();
        if (!email || emailSubmitted) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailDisplay.textContent = currentLang === 'fr' ? 'Email invalide...' : 'Invalid email...';
            scheduleRetexture();
            return;
        }
        emailSubmitted = true;
        emailInput.blur();
        emailDisplay.textContent = confirmations[currentLang];
        scheduleRetexture();
    }

    // --- Init ---
    document.fonts.ready.then(() => {
        resize();
        new ResizeObserver(resize).observe(content);
        requestAnimationFrame(draw);
    });
})();
