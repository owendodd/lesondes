import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Video,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { SLIDES, SlideDef } from "./slides";
import { computeTimeline } from "./timeline";

// ── Layout helpers (mirrors layoutSpaceSet in the web animation) ─────────────
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

// ── TextLine ─────────────────────────────────────────────────────────────────
// Renders a line of text as individual <span>s, each visible or hidden
// based on the current frame's timeline state.

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

// ── Props ─────────────────────────────────────────────────────────────────────

export interface IgAnimationProps {
  loops?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function IgAnimation({ loops = 1 }: IgAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // ── Font loading ────────────────────────────────────────────────────────────
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    const medium = new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Medium-Trial.woff2")})`,
      { weight: "400" }
    );
    const heavy = new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Heavy-Trial.woff2")})`,
      { weight: "700" }
    );
    Promise.all([medium.load(), heavy.load()])
      .then(() => {
        document.fonts.add(medium);
        document.fonts.add(heavy);
        continueRender(fontHandle);
      })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  // Pre-compute timeline once (stable across frames for the same loops value)
  const timeline = React.useMemo(
    () => computeTimeline(loops),
    [loops]
  );

  // Build visibility map: "lineId-charIndex" → boolean
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

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: "#fff",
        fontFamily: "ABCDiatype, sans-serif",
        fontWeight: 400,
        display: "flex",
        flexDirection: "column",
        padding: 48,
        gap: 48,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* SVG filter — same roughen effect as the web page */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5"
              numOctaves={4}
              seed={8}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={2.4}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Text section — top half */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {/* Slide 1: title, location, dates */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            filter: "url(#roughen)",
          }}
        >
          {SLIDES[0].lines.map((line) => (
            <p key={line.id} style={titleStyle}>
              <TextLine lineId={line.id} text={line.text} visibility={visibility} />
            </p>
          ))}
        </div>

        {/* Slide 2: artists A–F */}
        <SlideNames slide={SLIDES[1]} visibility={visibility} />

        {/* Slide 3: artists G–Z */}
        <SlideNames slide={SLIDES[2]} visibility={visibility} />
      </div>

      {/* Video section — bottom half */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Video
          src={staticFile("video/SamFinal.mp4")}
          loop
          playbackRate={0.9}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

function SlideNames({
  slide,
  visibility,
}: {
  slide: SlideDef;
  visibility: Map<string, boolean>;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "url(#roughen)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          width: "100%",
        }}
      >
        {slide.lines.map((line) => (
          <p key={line.id} style={nameStyle}>
            <TextLine lineId={line.id} text={line.text} visibility={visibility} />
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const titleStyle: React.CSSProperties = {
  fontSize: 100,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  color: "#000",
  whiteSpace: "pre",
  textAlign: "center",
  margin: 0,
};

const nameStyle: React.CSSProperties = {
  fontSize: 52,
  letterSpacing: "4.16px",
  textAlign: "center",
  width: "100%",
  margin: 0,
};
