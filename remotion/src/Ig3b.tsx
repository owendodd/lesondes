import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { SlideDef } from "./slides";
import { computeTimeline, computeTotalMs } from "./timeline";

// ── Slide definition ───────────────────────────────────────────────────────────

export const IG3B_SLIDES: SlideDef[] = [
  {
    id: "3b-header",
    direction: "column",
    lines: [
      { id: "3b-title",   text: "LES ONDES",   charDelay: 60, typeOutCharDelay: 40, spaceExtra: 20, pauseAfter: 0, startDelay: 80  },
      { id: "3b-cerbere", text: "Cerbère",      charDelay: 60, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 200 },
      { id: "3b-dates",   text: "May 29 30 31", charDelay: 25, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 400 },
    ],
    nextOverlap: 400,
    typeOutDelay: 800,
  },
];

// ── Layout helper ─────────────────────────────────────────────────────────────
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

// ── TextLine ──────────────────────────────────────────────────────────────────
function TextLine({
  lineId,
  text,
  visibility,
}: {
  lineId: string;
  text: string;
  visibility: Map<string, boolean>;
}) {
  const layout = layoutSpaceSet(text);
  const nodes: React.ReactNode[] = [];
  let charIndex = 0;
  let i = 0;

  for (const ch of text) {
    if (ch === "\n") {
      nodes.push(<br key={`br-${i}`} />);
    } else {
      const isVisible =
        layout.has(i) || (visibility.get(`${lineId}-${charIndex}`) ?? false);
      nodes.push(
        <span key={i} style={{ visibility: isVisible ? "visible" : "hidden" }}>
          {ch}
        </span>
      );
      charIndex++;
    }
    i++;
  }

  return <>{nodes}</>;
}

// ── Props ──────────────────────────────────────────────────────────────────────
export interface Ig3bProps {
  loops?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Ig3b({ loops = 1 }: Ig3bProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    const medium = new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`,
      { weight: "400" }
    );
    medium
      .load()
      .then(() => {
        document.fonts.add(medium);
        continueRender(fontHandle);
      })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  const timeline = React.useMemo(
    () => computeTimeline(loops, IG3B_SLIDES),
    [loops]
  );

  const visibility = React.useMemo(() => {
    const map = new Map<string, boolean>();
    for (const ev of timeline) {
      map.set(
        `${ev.lineId}-${ev.charIndex}`,
        currentMs >= ev.showMs && currentMs < ev.hideMs
      );
    }
    return map;
  }, [timeline, currentMs]);

  const slide = IG3B_SLIDES[0];

  return (
    <div
      style={{
        width: 2160,
        height: 2700,
        background: "#fff",
        fontFamily: "ABCDiatype, sans-serif",
        fontWeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 180,
          textAlign: "center",
        }}
      >
        {/* Row 1: Harry Lester + Clara Blum side by side */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 180 }}>
          {slide.lines.slice(0, 2).map((line) => (
            <p key={line.id} style={textStyle}>
              <TextLine lineId={line.id} text={line.text} visibility={visibility} />
            </p>
          ))}
        </div>
        {/* Row 2: venue */}
        <p style={textStyle}>
          <TextLine lineId={slide.lines[2].id} text={slide.lines[2].text} visibility={visibility} />
        </p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const textStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  color: "#000",
  fontSize: 180,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  textAlign: "center",
  whiteSpace: "nowrap",

};
