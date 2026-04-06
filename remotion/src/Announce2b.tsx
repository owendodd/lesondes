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
import { ANNOUNCE2_SLIDES } from "./Announce2";

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
export interface Announce2bProps {
  loops?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Announce2b({ loops = 1 }: Announce2bProps) {
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

      {/* SVG filter */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-ann2b" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={4.8} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Upper half: name / location / date lockup centered */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 2160,
          height: 1350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 100,
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

      {/* Lower half: video full bleed */}
      <div style={{ position: "absolute", top: 1350, left: 0, width: 2160, height: 1350, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("video/BG3_slow.mp4")}
          playbackRate={1.25}
          style={{ width: "100%", minWidth: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
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
  filter: "url(#roughen-ann2b)",
};
