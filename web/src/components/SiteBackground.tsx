'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated halftone-ocean background: the screen is perspective-projected onto
 * a water plane, a directional swell height field travels toward the viewer,
 * and each point's slope decides how much sky light it catches. The resulting
 * luminance is printed as a rotated screenprint dot grid — light blue ink on
 * white paper. Pure WebGL, no assets.
 */

// Halftone print
const CELL = 4          // dot cell size, CSS px
const ANGLE = 25        // screen grid rotation, degrees
const DOT_SCALE = 0.3   // max dot radius as a fraction of the cell
const LUMA_LO = 0.26    // luminance mapped to full ink
const LUMA_HI = 0.45    // luminance mapped to bare paper
const ROUGH = 0.5       // per-dot jitter + shape deformation
const INK: [number, number, number] = [0.655, 0.788, 0.949] // #a7c9f2
const PAPER: [number, number, number] = [1, 1, 1]

// Ocean
const SPEED = 2.2       // animation speed
const SCALE = 1.4       // wave size on the water plane
const CHOP = 0.75       // noise detail mixed into the swell
const GLINT = 1.2       // how strongly wave slopes catch light
const HORIZON = 0.6     // camera height / perspective compression
const TILT = 0.95       // camera pitch: ~0 = top-down, 1 = grazing
const SWELL_DIR = 16    // swell travel direction, degrees off straight-on

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

// mediump quantizes sin(u_time * …) into visible steps as time grows
// (it's genuinely fp16 on Apple GPUs), so this shader runs at highp.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_cell;

const float ANGLE = ${((ANGLE * Math.PI) / 180).toFixed(5)};
const float DOT_SCALE = ${DOT_SCALE.toFixed(3)};
const float LUMA_LO = ${LUMA_LO.toFixed(3)};
const float LUMA_HI = ${LUMA_HI.toFixed(3)};
const float ROUGH = ${ROUGH.toFixed(3)};
const vec3 INK = vec3(${INK.map(v => v.toFixed(3)).join(', ')});
const vec3 PAPER = vec3(${PAPER.map(v => v.toFixed(3)).join(', ')});
const float SCALE = ${SCALE.toFixed(3)};
const float CHOP = ${CHOP.toFixed(3)};
const float GLINT = ${GLINT.toFixed(3)};
const float HORIZON = ${HORIZON.toFixed(3)};
const float TILT = ${TILT.toFixed(3)};
const float DIR = ${((SWELL_DIR * Math.PI) / 180).toFixed(5)};

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  // 3 octaves: finer detail than this is invisible after halftone quantization
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

// thin broken lines where the noise folds — reads as breaking crests
float ridge(vec2 p) {
  return 1.0 - abs(2.0 * fbm(p) - 1.0);
}

// height of the sea surface in the swell's own frame: crests run along x,
// travel along y. Second harmonics sharpen the peaks so slopes aren't sine-soft.
float waveHeight(vec2 w, float t) {
  float ph = w.y + 0.45 * sin(w.x * 0.32 + t * 0.25) - t * 0.9;
  float h = sin(ph) + 0.35 * sin(2.0 * ph + 1.3);
  float ph2 = w.y * 2.1 + w.x * 0.31 - t * 1.5;
  h += 0.5 * (sin(ph2) + 0.3 * sin(2.0 * ph2 + 0.8));
  h += 0.35 * sin(dot(w, vec2(0.83, 0.44)) * 1.4 + t * 0.55);
  h += CHOP * 1.8 * (ridge(vec2(w.x * 0.5, w.y * 1.5) + vec2(0.0, -t * 0.5)) - 0.5);
  return h;
}

float sourceLuma(vec2 screenPos) {
  vec2 uv = screenPos / u_res;
  float t = u_time;

  // perspective projection onto the plane: rows near the top are far away.
  // TILT is the camera pitch (0 = top-down, 1 = grazing view to a horizon)
  float near = max(1.0 - uv.y, 0.02);
  float z = HORIZON * 8.0 * pow(1.0 / near, TILT);
  vec2 w = vec2((uv.x - 0.5) * (u_res.x / u_res.y) * z, z) * (SCALE * 2.25);

  // rotate the swell system so waves travel diagonally across the view,
  // then take the slope along the view direction — that's what catches light
  float dc = cos(DIR);
  float dsn = sin(DIR);
  float e = 0.35;
  vec2 wa = w + vec2(0.0, e);
  vec2 wb = w - vec2(0.0, e);
  vec2 wra = vec2(dc * wa.x - dsn * wa.y, dsn * wa.x + dc * wa.y);
  vec2 wrb = vec2(dc * wb.x - dsn * wb.y, dsn * wb.x + dc * wb.y);
  float slope = (waveHeight(wra, t) - waveHeight(wrb, t)) / (2.0 * e);

  // distant water flattens out and holds the sky's brightness; fading fast with
  // distance also mutes sub-cell wave frequencies that would otherwise shimmer
  float fade = 1.0 / (1.0 + z * 0.09);
  float sky = mix(0.58, 0.40, near);
  return clamp(sky + GLINT * 0.35 * slope * fade, 0.0, 1.0);
}

vec2 rotate(vec2 p, float c, float s) {
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

float hashCell(vec2 p) {
  return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
}

void main() {
  float c = cos(ANGLE);
  float s = sin(ANGLE);
  vec2 p = rotate(gl_FragCoord.xy, c, s);
  vec2 cellId = floor(p / u_cell);
  vec2 center = (cellId + 0.5) * u_cell;
  vec2 screenCenter = rotate(center, c, -s); // inverse rotation
  float h = hashCell(cellId);

  // per-cell threshold dither: with a narrow luma window dots are near-binary,
  // and without this whole wavefronts of them pop on the same frame
  float luma = sourceLuma(screenCenter) + (h - 0.5) * 0.05;
  float darkness = 1.0 - smoothstep(LUMA_LO, LUMA_HI, luma);

  // ink misregistration: each dot drifts a little inside its cell...
  vec2 jitter = (vec2(h, fract(h * 34.7)) - 0.5) * u_cell * 0.35 * ROUGH;
  vec2 delta = p - (center + jitter);

  // ...and squashes out of round, so dots read as printed rather than perfect circles
  float ang = atan(delta.y, delta.x);
  float wobble = 1.0 + ROUGH * (0.30 * sin(ang * 3.0 + h * 6.2831)
                              + 0.20 * sin(ang * 5.0 + h * 12.566));

  float radius = darkness * u_cell * DOT_SCALE;
  float dist = length(delta) * wobble;
  float dot_ = 1.0 - smoothstep(radius - 0.8, radius + 0.8, dist);
  gl_FragColor = vec4(mix(PAPER, INK, dot_), 1.0);
}
`

function buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)
    if (!sh) return null
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('shader error:', gl.getShaderInfoLog(sh))
      return null
    }
    return sh
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  if (!prog) return null
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('program error:', gl.getProgramInfoLog(prog))
    return null
  }
  return prog
}

export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false })
    if (!gl) return // canvas keeps its white CSS background as fallback

    const prog = buildProgram(gl)
    if (!prog) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uCell = gl.getUniformLocation(prog, 'u_cell')

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    gl.uniform1f(uCell, CELL * dpr)

    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let time = 0
    let last = performance.now()

    const frame = () => {
      raf = requestAnimationFrame(frame)
      const now = performance.now()
      time += ((now - last) / 1000) * (reducedMotion ? 0 : SPEED)
      last = now
      // keep the time uniform small so sin() phases never lose float precision;
      // one imperceptible-ish jump every couple of hours beats gradual stepping
      if (time > 7200) time -= 7200
      gl.uniform1f(uTime, time)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (reducedMotion) cancelAnimationFrame(raf) // a single still frame is enough
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      // Don't lose the context: the same canvas context is reused when the
      // effect re-runs (dev StrictMode) — just free the resources.
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full bg-white"
    />
  )
}
