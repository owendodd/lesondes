import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { FINAL_D_SLIDES } from "./final-slides";
import { computeTimeline, computeTotalMs } from "./timeline";

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

function TextLine({ lineId, text, visibility }: {
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
      const isVisible = layout.has(i) || (visibility.get(`${lineId}-${charIndex}`) ?? false);
      nodes.push(
        <span key={i} style={{ visibility: isVisible ? "visible" : "hidden" }}>{ch}</span>
      );
      charIndex++;
    }
    i++;
  }
  return <>{nodes}</>;
}

export interface IgFinalDProps {
  loops?: number;
}

export function IgFinalD({ loops = 1 }: IgFinalDProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    const medium = new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" });
    const heavy  = new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`,  { weight: "700" });
    Promise.all([medium.load(), heavy.load()]).then(() => {
      document.fonts.add(medium);
      document.fonts.add(heavy);
      continueRender(fontHandle);
    }).catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  const timeline = React.useMemo(() => computeTimeline(loops, FINAL_D_SLIDES), [loops]);

  const visibility = React.useMemo(() => {
    const map = new Map<string, boolean>();
    for (const ev of timeline) {
      map.set(`${ev.lineId}-${ev.charIndex}`, currentMs >= ev.showMs && currentMs < ev.hideMs);
    }
    return map;
  }, [timeline, currentMs]);

  return (
    <div style={{ width: 1080, height: 1350, background: "#fff", position: "relative", overflow: "hidden" }}>
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-fd" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves={4} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
          {/* Food block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {FINAL_D_SLIDES[0].lines.slice(0, 2).map((line) => (
              <p key={line.id} style={textStyle}>
                <TextLine lineId={line.id} text={line.text} visibility={visibility} />
              </p>
            ))}
          </div>
          {/* Wine block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {FINAL_D_SLIDES[0].lines.slice(2).map((line) => (
              <p key={line.id} style={textStyle}>
                <TextLine lineId={line.id} text={line.text} visibility={visibility} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const textStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  color: "#000",
  fontSize: 64,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  textAlign: "center",
  whiteSpace: "nowrap",
  filter: "url(#roughen-fd)",
};
