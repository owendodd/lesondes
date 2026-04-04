import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Video,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { POST3_SLIDES } from "./post3-slides";
import { computeTimeline } from "./timeline";

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
export interface IgPost3Props {
  loops?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function IgPost3({ loops = 1 }: IgPost3Props) {
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
    const heavy = new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`,
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

  const timeline = React.useMemo(
    () => computeTimeline(loops, POST3_SLIDES),
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
      {/* SVG filter */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-p3" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1"
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

      {/* Text section — top half, one slide at a time centered */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {POST3_SLIDES.map((slide) => {
          const isHeader = slide.id === "p3-header";
          return (
            <div
              key={slide.id}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: isHeader ? "column" : (slide.lines.length > 1 ? "row" : "column"),
                alignItems: "center",
                gap: isHeader ? 32 : 40,
                textAlign: "center",
              }}
            >
              {isHeader ? (
                <>
                  {/* Title row: LES ONDES + Cerbère side by side */}
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 40 }}>
                    {slide.lines.slice(0, 2).map((line) => (
                      <p key={line.id} style={textStyle}>
                        <TextLine lineId={line.id} text={line.text} visibility={visibility} />
                      </p>
                    ))}
                  </div>
                  {/* Date row */}
                  <p style={textStyle}>
                    <TextLine lineId={slide.lines[2].id} text={slide.lines[2].text} visibility={visibility} />
                  </p>
                </>
              ) : (
                slide.lines.map((line) => (
                  <p key={line.id} style={textStyle}>
                    <TextLine lineId={line.id} text={line.text} visibility={visibility} />
                  </p>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Video section — bottom half */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Video
          src={staticFile("video/WebBg.webm")}
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

// ── Styles ────────────────────────────────────────────────────────────────────

const textStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  color: "#000",
  fontSize: 76,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  textAlign: "center",
  whiteSpace: "nowrap",
  filter: "url(#roughen-p3)",
};
