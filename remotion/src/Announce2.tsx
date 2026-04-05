import React, { useEffect, useState } from "react";
import {
  OffthreadVideo,
  staticFile,
  delayRender,
  continueRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SlideDef } from "./slides";
import { computeTimeline } from "./timeline";

// ── Slide definition ───────────────────────────────────────────────────────────

export const ANNOUNCE2_SLIDES: SlideDef[] = [
  {
    id: "ann2",
    direction: "column",
    nextOverlap: -1000,
    typeOutDelay: 800,
    lines: [
      { id: "ann2-title",   text: "LES ONDES",   charDelay: 70, typeOutCharDelay: 40, pauseAfter: 60,  startDelay: 1000 },
      { id: "ann2-cerbere", text: "Cerbère",      charDelay: 53, typeOutCharDelay: 40, pauseAfter: 60 },
      { id: "ann2-dates",   text: "May 29 30 31", charDelay: 43, typeOutCharDelay: 40, spaceExtra: 53, pauseAfter: 0 },
    ],
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
export interface Announce2Props {
  loops?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Announce2({ loops = 1 }: Announce2Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load()
      .then((face) => { document.fonts.add(face); continueRender(fontHandle); })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  const timeline = React.useMemo(
    () => computeTimeline(loops, ANNOUNCE2_SLIDES),
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

  const slide = ANNOUNCE2_SLIDES[0];
  const [titleLine, cerbereLine, datesLine] = slide.lines;

  return (
    <div style={{ width: 2160, height: 2700, background: "#fff", position: "relative", overflow: "hidden" }}>


      {/* Upper half: video full bleed */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 2160, height: 1350, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("video/BG3_crop.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Lower half: name / location / date lockup centered */}
      <div
        style={{
          position: "absolute",
          top: 1350,
          left: 0,
          width: 2160,
          height: 1350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 140,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 120 }}>
          <p style={titleStyle}>
            <TextLine lineId={titleLine.id} text={titleLine.text} visibility={visibility} />
          </p>
          <p style={titleStyle}>
            <TextLine lineId={cerbereLine.id} text={cerbereLine.text} visibility={visibility} />
          </p>
        </div>
        <p style={titleStyle}>
          <TextLine lineId={datesLine.id} text={datesLine.text} visibility={visibility} />
        </p>
      </div>

    </div>
  );
}

const titleStyle: React.CSSProperties = {
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
