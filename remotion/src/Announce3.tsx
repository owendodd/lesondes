import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { SlideDef } from "./slides";
import { computeTimeline } from "./timeline";

// ── Slide definition ───────────────────────────────────────────────────────────

export const ANNOUNCE3_SLIDES: SlideDef[] = [
  {
    id: "ann3-info",
    direction: "column",
    lines: [
      { id: "ann3-01", text: "Food from\nHarry Lester",              charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "ann3-02", text: "Wine selections by\nClara Blum",       charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
      { id: "ann3-03", text: "l'Hôtel le Belvédère\ndu Rayon Vert",  charDelay: 40, typeOutCharDelay: 40, pauseAfter: 0, startDelay: 80 },
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
export interface Announce3Props {
  loops?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Announce3({ loops = 1 }: Announce3Props) {
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
    () => computeTimeline(loops, ANNOUNCE3_SLIDES),
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

  const slide = ANNOUNCE3_SLIDES[0];

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
          <filter id="roughen-ann3" x="-5%" y="-5%" width="110%" height="110%">
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
          gap: 180,
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
  filter: "url(#roughen-ann3)",
};
