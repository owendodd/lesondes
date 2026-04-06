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

export const ANNOUNCE1_SLIDES: SlideDef[] = [
  {
    id: "ann1-artists",
    direction: "column",
    lines: [
      { id: "a1-01", text: "Miriam Adefris",          charDelay: 38, typeOutCharDelay: 35, pauseAfter: 0, startDelay: 75 },
      { id: "a1-02", text: "Pierre Bastien",           charDelay: 44, typeOutCharDelay: 42, pauseAfter: 0, startDelay: 90 },
      { id: "a1-03", text: "CTM",                      charDelay: 55, typeOutCharDelay: 50, pauseAfter: 0, startDelay: 70 },
      { id: "a1-04", text: "Lukas de Clerck",          charDelay: 36, typeOutCharDelay: 38, pauseAfter: 0, startDelay: 85 },
      { id: "a1-05", text: "Maya Dhondt",              charDelay: 48, typeOutCharDelay: 44, pauseAfter: 0, startDelay: 65 },
      { id: "a1-06", text: "Mats Erlandsson",          charDelay: 42, typeOutCharDelay: 36, pauseAfter: 0, startDelay: 95 },
      { id: "a1-07", text: "Elisabeth Klinck",         charDelay: 34, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "a1-08", text: "Louis Laurain",            charDelay: 50, typeOutCharDelay: 46, pauseAfter: 0, startDelay: 70 },
{ id: "a1-10", text: "Lubomyr Melnyk",           charDelay: 40, typeOutCharDelay: 34, pauseAfter: 0, startDelay: 90 },
      { id: "a1-11", text: "Chantal Michelle",         charDelay: 46, typeOutCharDelay: 42, pauseAfter: 0, startDelay: 75 },
      { id: "a1-12", text: "Mohammad Reza\nMortazavi", charDelay: 36, typeOutCharDelay: 38, pauseAfter: 0, startDelay: 85 },
      { id: "a1-13", text: "Fredrik Rasten",           charDelay: 52, typeOutCharDelay: 48, pauseAfter: 0, startDelay: 65 },
      { id: "a1-14", text: "Youmna Saba",              charDelay: 44, typeOutCharDelay: 36, pauseAfter: 0, startDelay: 80 },
    ],
    nextOverlap: 400,
    typeOutDelay: 100,
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
export interface Announce1Props {
  loops?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Announce1({ loops = 1 }: Announce1Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`,
      { weight: "400" }
    )
      .load()
      .then((face) => { document.fonts.add(face); continueRender(fontHandle); })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  const timeline = React.useMemo(
    () => computeTimeline(loops, ANNOUNCE1_SLIDES),
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

  const slide = ANNOUNCE1_SLIDES[0];

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
          <filter id="roughen-ann1" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={4.8} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
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
  fontSize: 140,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  textAlign: "center",
  whiteSpace: "nowrap",
  filter: "url(#roughen-ann1)",
};
