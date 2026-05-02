import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";

export const igDj2FramesPerRotation = (fps: number) =>
  Math.ceil((60 / 8.25) * fps);

export interface IgDj2Props {
  loops?: number;
}

export function IgDj2({ loops = 1 }: IgDj2Props) {
  const frame = useCurrentFrame();
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  const [imgHandle] = useState(() => delayRender("img:IgDj2.jpg"));
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
  useEffect(() => {
    const img = new Image();
    img.src = staticFile("images/IgDj2.jpg");
    img.onload = () => continueRender(imgHandle);
    img.onerror = () => continueRender(imgHandle);
  }, []);

  const { fps } = useVideoConfig();
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
          <filter id="roughen-igdj2" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Background image */}
      <img
        src={staticFile("images/IgDj2.jpg")}
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

      {/* Top-left info block */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 96,
          display: "flex",
          flexDirection: "column",
          gap: 32,
          width: 606,
        }}
      >
        <p style={smallText}>LES ONDES{"    "}Cerbère</p>
        <p style={smallText}>
          Hôtel le Belvédère{" "}
          <br />
          du Rayon Vert
        </p>
        <p style={smallText}>
          Afters vinyl set
          <br />
          May 29, 23h–late
        </p>
      </div>

      {/* Rotating center: Souleymane Said · (Latency) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <p style={{ ...largeText, paddingTop: 40, paddingBottom: 80 }}>Souleymane Said</p>
        <div style={{ width: 64, height: 64, flexShrink: 0 }} />
        <p style={{ ...largeText, fontStyle: "italic", paddingTop: 40, paddingBottom: 70, paddingRight: 40 }}>(Latency)</p>
      </div>

      {/* Static center dot */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "#000",
          opacity: 0.95,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

const smallText: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  fontSize: 56,
  lineHeight: 1.1,
  letterSpacing: "1.04px",
  color: "#000",
  opacity: 0.95,
  filter: "url(#roughen-igdj2)",
};

const largeText: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  fontSize: 220,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: "#000",
  textAlign: "center",
  whiteSpace: "nowrap",
  opacity: 0.9,
  filter: "url(#roughen-igdj2)",
};
