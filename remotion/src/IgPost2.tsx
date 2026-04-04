import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Video,
  staticFile,
  delayRender,
  continueRender,
  interpolate,
} from "remotion";
import { SLIDES } from "./slides";

export interface IgPost2Props {
  durationSec?: number;
}

// From Figma: 48px padding, video 984×603, text starts at top: 50% = 675px
const PADDING = 48;
const VIDEO_WIDTH = 984; // 1080 - 2 * PADDING
const VIDEO_HEIGHT = 603;
const TEXT_TOP = 675; // 50% of 1350

// Start: first line just below the frame bottom (1350 - TEXT_TOP + buffer)
const SCROLL_START = 1350 - TEXT_TOP + 80; // ≈ 755px — first line enters from off-screen below
// End: all text scrolled behind/above the video (last line bottom < video bottom 651)
// 14 lines × 124px + 1 × 248px = 1984px content. Last line bottom at TEXT_TOP+1984 = 2659. Need > 2008.
const SCROLL_END = -2300;

const allLines = [
  ...SLIDES[0].lines,
  ...SLIDES[1].lines,
  ...SLIDES[2].lines,
];

export function IgPost2({ durationSec = 22 }: IgPost2Props) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

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

  const translateY = interpolate(frame, [0, durationInFrames], [SCROLL_START, SCROLL_END]);

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* SVG filter — same as IgPost */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-p2" x="-5%" y="-5%" width="110%" height="110%">
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

      {/* Text column — starts at 50% (675px), scrolls upward */}
      <div
        style={{
          position: "absolute",
          top: TEXT_TOP,
          left: PADDING,
          width: VIDEO_WIDTH,
          transform: `translateY(${translateY}px)`,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "ABCDiatype, sans-serif",
          fontWeight: 400,
          fontSize: 124,
          lineHeight: 1,
          letterSpacing: "-2.48px",
          color: "#000",
        }}
      >
        {allLines.map((line) => (
          <p
            key={line.id}
            style={{
              margin: 0,
              whiteSpace: line.id === "b4" ? "pre-wrap" : "nowrap",
              filter: "url(#roughen-p2)",
            }}
          >
            {line.id === "b4" ? "Mohammad Reza\nMortazavi" : line.text.trim()}
          </p>
        ))}
      </div>

      {/* White cover for top padding — hides text in the 48px strip above the video */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: PADDING,
          background: "#fff",
          zIndex: 2,
        }}
      />

      {/* Video — sits above text, covers it as text scrolls into the video area */}
      <div
        style={{
          position: "absolute",
          top: PADDING,
          left: PADDING,
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          overflow: "hidden",
          zIndex: 2,
        }}
      >
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
