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

// ── Props ──────────────────────────────────────────────────────────────────────
export interface IgStoryProps {
  durationSec?: number;
}

const ARTISTS = [
  "Miriam Adefris",
  "Pierre Bastien",
  "Lukas de Clerck",
  "Maya Dhondt",
  "Mats Erlandsson",
  "Elisabeth Klinck",
  "Louis Laurain",
  "Lubomyr Melnyk",
  "Chantal Michelle",
  "Mohammad Reza\nMortazavi",
  "Fredrik Rasten",
  "Youmna Saba",
];

const FADE = 3; // frames for fade in/out

// ── Component ──────────────────────────────────────────────────────────────────
export function IgStory({ durationSec = 10 }: IgStoryProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Font loading ────────────────────────────────────────────────────────────
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

  const total = durationSec * fps;
  // Slide boundaries: slide 1 = 25%, slide 2 = 25%, slide 3 = 50%
  const s1End = Math.round(total * 0.25);
  const s2End = Math.round(total * 0.5);

  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  const opacity1 = interpolate(frame, [0, FADE, s1End - FADE, s1End], [0, 1, 1, 0], clamp);
  const opacity2 = interpolate(frame, [s1End, s1End + FADE, s2End - FADE, s2End], [0, 1, 1, 0], clamp);
  const opacity3 = interpolate(frame, [s2End, s2End + FADE, total], [0, 1, 1], clamp);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        overflow: "hidden",
        position: "relative",
        background: "#000",
      }}
    >
      {/* Full-screen video background */}
      <Video
        src={staticFile("video/WebBg.webm")}
        loop
        playbackRate={0.9}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* SVG displacement filter */}
        <svg style={{ display: "none" }} aria-hidden="true">
          <defs>
            <filter id="roughen-story" x="-5%" y="-5%" width="110%" height="110%">
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

        {/* Slide 1: LES ONDES + Cerbère */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: opacity1 }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 48 }}>
            <p style={textStyle}>LES ONDES</p>
            <p style={textStyle}>Cerbère</p>
          </div>
        </div>

        {/* Slide 2: Dates */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: opacity2 }}>
          <p style={textStyle}>May 29 30 31</p>
        </div>

        {/* Slide 3: Artists */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: opacity3 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
            {ARTISTS.map((name, i) => (
              <p key={i} style={textStyle}>{name}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const textStyle: React.CSSProperties = {
  fontSize: 80,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: "#fff",
  whiteSpace: "pre",
  textAlign: "center",
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  filter: "url(#roughen-story)",
};
