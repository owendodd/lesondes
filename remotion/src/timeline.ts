import { SLIDES, SlideDef } from "./slides";

export interface TimelineEvent {
  lineId: string;
  charIndex: number; // index among rendered spans (non-newline chars)
  showMs: number;
  hideMs: number;
}

// Mirrors the layoutSpaceSet helper from the web animation —
// returns indices of chars that are always visible (leading/trailing/newline-adjacent spaces).
function layoutSpaceSet(text: string): Set<number> {
  const s = new Set<number>();
  let i = 0;
  while (i < text.length && text[i] === " ") s.add(i++);
  i = text.length - 1;
  while (i >= 0 && text[i] === " ") s.add(i--);
  for (let j = 0; j < text.length; j++) {
    if (text[j] === "\n") {
      let k = j - 1;
      while (k >= 0 && text[k] === " ") s.add(k--);
      k = j + 1;
      while (k < text.length && text[k] === " ") s.add(k++);
    }
  }
  return s;
}

interface CharOffset {
  lineId: string;
  charIndex: number;
  relativeMs: number;
}

// Computes the relative timing (ms from slide start) for each animated character.
// When useTypeOut is true, uses typeOutCharDelay (if set) instead of charDelay,
// and skips startDelay/spaceExtra (untype is uniform).
function buildCharOffsets(slide: SlideDef, useTypeOut = false): {
  offsets: CharOffset[];
  duration: number;
} {
  const offsets: CharOffset[] = [];
  let cursor = 0;

  for (const line of slide.lines) {
    if (!useTypeOut) cursor += line.startDelay ?? 0;
    const cd = useTypeOut ? (line.typeOutCharDelay ?? line.charDelay) : line.charDelay;
    const se = useTypeOut ? 0 : (line.spaceExtra ?? 0);
    let t = cursor;
    let charIdx = 0;
    const layout = layoutSpaceSet(line.text);
    let i = 0;
    for (const ch of line.text) {
      if (ch !== "\n") {
        if (!layout.has(i)) {
          offsets.push({ lineId: line.id, charIndex: charIdx, relativeMs: t });
          t += cd + (ch === " " ? se : 0);
        }
        charIdx++;
      }
      i++;
    }
    cursor = t + (useTypeOut ? 0 : line.pauseAfter);
  }

  return { offsets, duration: cursor };
}

// Builds a complete flat timeline for `loops` full cycles.
// Each event records when a character becomes visible and when it's hidden again.
export function computeTimeline(loops = 1, slides: SlideDef[] = SLIDES): TimelineEvent[] {
  // First compute one cycle
  const singleEvents: TimelineEvent[] = [];
  let slideStartMs = 0;

  for (const slide of slides) {
    const { offsets: typeInOffsets, duration: typeInDuration } = buildCharOffsets(slide, false);
    const { offsets: typeOutOffsets, duration: typeOutDuration } = buildCharOffsets(slide, true);
    const typeOutStartMs = slideStartMs + typeInDuration + (slide.typeOutDelay ?? 300);

    for (let i = 0; i < typeInOffsets.length; i++) {
      singleEvents.push({
        lineId: typeInOffsets[i].lineId,
        charIndex: typeInOffsets[i].charIndex,
        showMs: slideStartMs + typeInOffsets[i].relativeMs,
        hideMs: typeOutStartMs + typeOutOffsets[i].relativeMs,
      });
    }

    // Next slide starts after type-out finishes, shifted by nextOverlap
    slideStartMs = typeOutStartMs + typeOutDuration + slide.nextOverlap;
  }

  // slideStartMs now holds when the next (first) cycle would begin
  const cycleDurationMs = slideStartMs;

  if (loops === 1) return singleEvents;

  const allEvents: TimelineEvent[] = [];
  for (let loop = 0; loop < loops; loop++) {
    const offset = loop * cycleDurationMs;
    for (const ev of singleEvents) {
      allEvents.push({
        ...ev,
        showMs: ev.showMs + offset,
        hideMs: ev.hideMs + offset,
      });
    }
  }
  return allEvents;
}

// Total duration in ms for `loops` cycles (used to size the composition).
export function computeTotalMs(loops = 1, slides: SlideDef[] = SLIDES): number {
  const events = computeTimeline(loops, slides);
  return Math.max(...events.map((e) => e.hideMs)) + 500;
}

// Timeline where every character types in sequentially across all slides,
// but never hides — all text accumulates on screen.
// untypeBeforeEnd: if set, characters start untyping (in reverse show order)
// this many ms before the last character finishes typing in.
export function computeStayTimeline(slides: SlideDef[] = SLIDES, speed = 1, untypeBeforeEnd?: number): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  let slideStartMs = 0;

  for (const slide of slides) {
    const { offsets, duration } = buildCharOffsets(slide, false);
    for (const o of offsets) {
      events.push({
        lineId: o.lineId,
        charIndex: o.charIndex,
        showMs: (slideStartMs + o.relativeMs) / speed,
        hideMs: Number.MAX_SAFE_INTEGER,
      });
    }
    slideStartMs += duration;
  }

  if (untypeBeforeEnd !== undefined && events.length > 1) {
    const lastShowMs = Math.max(...events.map((e) => e.showMs));
    const firstShowMs = Math.min(...events.map((e) => e.showMs));
    const untypeStart = lastShowMs - untypeBeforeEnd;
    const avgInterval = (lastShowMs - firstShowMs) / (events.length - 1);

    // Forward show order: first typed = first to disappear
    const sorted = [...events].sort((a, b) => a.showMs - b.showMs);
    const hideMap = new Map<string, number>();
    sorted.forEach((ev, i) => {
      hideMap.set(`${ev.lineId}-${ev.charIndex}`, untypeStart + i * avgInterval);
    });

    for (const ev of events) {
      ev.hideMs = hideMap.get(`${ev.lineId}-${ev.charIndex}`) ?? Number.MAX_SAFE_INTEGER;
    }
  }

  return events;
}

export function computeStayTotalMs(slides: SlideDef[] = SLIDES, speed = 1, untypeBeforeEnd?: number): number {
  const events = computeStayTimeline(slides, speed, untypeBeforeEnd);
  if (events.length === 0) return 1000;
  const lastEvent = Math.max(...events.map((e) => e.hideMs === Number.MAX_SAFE_INTEGER ? e.showMs : e.hideMs));
  return lastEvent + 500;
}
