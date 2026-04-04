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

export const IG1B_SLIDES: SlideDef[] = [
  {
    id: "1b-artists",
    direction: "column",
    lines: [
      { id: "1b-a01", text: "Miriam Adefris",          charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a02", text: "Pierre Bastien",           charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a03", text: "CTM",                      charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a04", text: "Lukas de Clerck",          charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a05", text: "Maya Dhondt",              charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a06", text: "Mats Erlandsson",          charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a07", text: "Elisabeth Klinck",         charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a08", text: "Louis Laurain",            charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a09", text: "Molly Lewis",              charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a10", text: "Lubomyr Melnyk",           charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a11", text: "Chantal Michelle",         charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a12", text: "Mohammad Reza\nMortazavi", charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a13", text: "Fredrik Rasten",           charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "1b-a14", text: "Youmna Saba",              charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
    ],
    nextOverlap: 400,
    typeOutDelay: -2400,
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
export interface Ig1bProps {
  loops?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Ig1b({ loops = 1 }: Ig1bProps) {
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
    () => computeTimeline(loops, IG1B_SLIDES),
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

  const slide = IG1B_SLIDES[0];

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
      {/* SVG filter */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-1b" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          textAlign: "center",
        }}
      >
        {slide.lines.map((line) => (
          <p key={line.id} style={textStyle}>
            <TextLine lineId={line.id} text={line.text} visibility={visibility} />
          </p>
        ))}
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
  fontSize: 120,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  textAlign: "center",
  whiteSpace: "nowrap",
  filter: "url(#roughen-1b)",
};
