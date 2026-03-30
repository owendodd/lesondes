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

// Computes the relative timing (ms from slide start) for each animated character,
// and returns the total duration of one type-in pass.
// Type-out uses identical timing, just toggling visibility in the opposite direction.
function buildCharOffsets(slide: SlideDef): {
  offsets: CharOffset[];
  duration: number;
} {
  const offsets: CharOffset[] = [];
  let cursor = 0;

  for (const line of slide.lines) {
    cursor += line.startDelay ?? 0;
    let t = cursor;
    let charIdx = 0;
    const layout = layoutSpaceSet(line.text);
    let i = 0;
    for (const ch of line.text) {
      if (ch !== "\n") {
        if (!layout.has(i)) {
          offsets.push({ lineId: line.id, charIndex: charIdx, relativeMs: t });
          t += line.charDelay + (ch === " " ? (line.spaceExtra ?? 0) : 0);
        }
        charIdx++;
      }
      i++;
    }
    cursor = t + line.pauseAfter;
  }

  return { offsets, duration: cursor };
}

// Builds a complete flat timeline for `loops` full cycles.
// Each event records when a character becomes visible and when it's hidden again.
export function computeTimeline(loops = 1): TimelineEvent[] {
  // First compute one cycle
  const singleEvents: TimelineEvent[] = [];
  let slideStartMs = 0;

  for (const slide of SLIDES) {
    const { offsets, duration: typeInDuration } = buildCharOffsets(slide);
    // Type-out begins 300ms after the last type-in character appears
    const typeOutStartMs = slideStartMs + typeInDuration + 300;

    for (const { lineId, charIndex, relativeMs } of offsets) {
      singleEvents.push({
        lineId,
        charIndex,
        showMs: slideStartMs + relativeMs,
        // Type-out mirrors type-in timing, so the offset from typeOutStartMs is identical
        hideMs: typeOutStartMs + relativeMs,
      });
    }

    // Next slide starts after type-out finishes, shifted by nextOverlap
    slideStartMs = typeOutStartMs + typeInDuration + slide.nextOverlap;
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
export function computeTotalMs(loops = 1): number {
  const events = computeTimeline(loops);
  return Math.max(...events.map((e) => e.hideMs)) + 500;
}
