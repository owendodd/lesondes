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

export interface IgStory2Props {
  durationSec?: number;
}

// From Figma: video 661.83px, text area fills remainder of 1920px frame
const VIDEO_HEIGHT = 662;
const BOTTOM_HEIGHT = 1258; // 1920 - VIDEO_HEIGHT
const CONTENT_H = 2476;     // CSS height of text column = visual width after 90° rotation

// Inner div offsets to center it within the outer wrapper after rotation
const INNER_TOP = (BOTTOM_HEIGHT - CONTENT_H) / 2;  // -609
const INNER_LEFT = (CONTENT_H - BOTTOM_HEIGHT) / 2; // 609

export function IgStory2({ durationSec = 30 }: IgStory2Props) {
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

  // Outer wrapper scrolls from fully off-screen left to fully off-screen right
  const scrollLeft = interpolate(
    frame,
    [0, durationInFrames],
    [-(CONTENT_H + 100), 1080 + 100]
  );

  const allArtists = [...SLIDES[1].lines, ...SLIDES[2].lines];

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        overflow: "hidden",
        background: "#fff",
        position: "relative",
      }}
    >
      {/* SVG filter — same as IgPost */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-s2" x="-5%" y="-5%" width="110%" height="110%">
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

      {/* Video — top aligned, full width */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: VIDEO_HEIGHT,
          overflow: "hidden",
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

      {/* White background for text area */}
      <div
        style={{
          position: "absolute",
          top: VIDEO_HEIGHT,
          left: 0,
          width: 1080,
          height: BOTTOM_HEIGHT,
          background: "#fff",
        }}
      />

      {/* Outer scrolling wrapper — 2476px wide, slides left→right */}
      <div
        style={{
          position: "absolute",
          top: VIDEO_HEIGHT,
          left: scrollLeft,
          width: CONTENT_H,
          height: BOTTOM_HEIGHT,
          overflow: "visible",
        }}
      >
        {/* Inner text column — rotated 90° CW, centered in outer wrapper */}
        <div
          style={{
            position: "absolute",
            top: INNER_TOP,
            left: INNER_LEFT,
            width: BOTTOM_HEIGHT,
            height: CONTENT_H,
            transform: "rotate(90deg)",
            transformOrigin: "center center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 120,
            paddingBottom: 120,
            gap: 48,
            boxSizing: "border-box",
            fontFamily: "ABCDiatype, sans-serif",
            fontWeight: 400,
            color: "#000",
            textAlign: "center",
          }}
        >
          {/* Title: LES ONDES / Cerbère / May 29 30 31 */}
          {SLIDES[0].lines.map((line) => (
            <p key={line.id} style={titleStyle}>
              {line.text.trim()}
            </p>
          ))}

          {/* Visual spacer between title and artists */}
          <p style={spacerStyle}>&nbsp;</p>

          {/* All 12 artist names */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              width: "100%",
            }}
          >
            {allArtists.map((line) =>
              line.id === "b4" ? (
                <p key={line.id} style={artistStyle}>
                  Mohammad Reza
                  <br />
                  Mortazavi
                </p>
              ) : (
                <p key={line.id} style={artistStyle}>
                  {line.text}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const titleStyle: React.CSSProperties = {
  fontSize: 140,
  lineHeight: 1.1,
  letterSpacing: "-2.8px",
  margin: 0,
  whiteSpace: "nowrap",
  filter: "url(#roughen-s2)",
};

const spacerStyle: React.CSSProperties = {
  fontSize: 100,
  lineHeight: 1.1,
  letterSpacing: "-2px",
  margin: 0,
};

const artistStyle: React.CSSProperties = {
  fontSize: 68,
  lineHeight: 1,
  letterSpacing: "5.44px",
  margin: 0,
  width: "100%",
  whiteSpace: "nowrap",
  filter: "url(#roughen-s2)",
};
