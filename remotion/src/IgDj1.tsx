import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";

// One full rotation at 8.25rpm (quarter of 33rpm) in frames
export const igDj1FramesPerRotation = (fps: number) =>
  Math.ceil((60 / 8.25) * fps);

export interface IgDj1Props {
  loops?: number;
}

export function IgDj1({ loops = 1 }: IgDj1Props) {
  const frame = useCurrentFrame();
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`,
      { weight: "400" }
    )
      .load()
      .then((face) => {
        document.fonts.add(face);
        continueRender(fontHandle);
      })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  const { fps } = useVideoConfig();
  // 8.25rpm linear rotation
  const degreesPerFrame = (360 * 8.25) / 60 / fps;
  const rotation = frame * degreesPerFrame;

  return (
    <div
      style={{
        width: 2160,
        height: 2700,
        position: "relative",
        overflow: "hidden",
        fontFamily: "ABCDiatype, sans-serif",
      }}
    >
      {/* Roughen filter */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-igdj1" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Background image */}
      <img
        src={staticFile("images/IgDj1.jpg")}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* "Apéro" — top center */}
      <p
        style={{
          ...text,
          position: "absolute",
          top: 96,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Apéro
      </p>

      {/* Fixed dot at canvas center, between the two rotating lines */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "#000",
        }}
      />

      {/* "Horasse / (La Becque)" — centered, rotating at 33rpm */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p style={{ ...text, paddingTop: 40, paddingBottom: 70 }}>Horasse</p>
        <p style={{ ...text, fontStyle: "italic", paddingTop: 40, paddingBottom: 70 }}>(La Becque)</p>
      </div>

      {/* "LES ONDES   Cerbère" — near bottom */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(50% + 1054px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 128,
        }}
      >
        <p style={{ ...text, whiteSpace: "nowrap" }}>LES ONDES</p>
        <p style={{ ...text, whiteSpace: "nowrap" }}>Cerbère</p>
      </div>
    </div>
  );
}

const text: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  fontSize: 200,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: "#000",
  textAlign: "center",
  whiteSpace: "nowrap",
  opacity: 0.9,
  filter: "url(#roughen-igdj1)",
};
