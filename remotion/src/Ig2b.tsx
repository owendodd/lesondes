import React, { useEffect, useState } from "react";
import { OffthreadVideo, staticFile, delayRender, continueRender } from "remotion";

export interface Ig2bProps {
  durationSec?: number;
}

export function Ig2b(_props: Ig2bProps) {
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load()
      .then((face) => { document.fonts.add(face); continueRender(fontHandle); })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  return (
    <div style={{ width: 2160, height: 2700, background: "#fff", position: "relative", overflow: "hidden" }}>


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
          gap: 180,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 120 }}>
          <p style={titleStyle}>LES ONDES</p>
          <p style={titleStyle}>Cerbère</p>
        </div>
        <p style={titleStyle}>May 29 30 31</p>
      </div>

      {/* Lower half: video full bleed */}
      <div style={{ position: "absolute", top: 1350, left: 0, width: 2160, height: 1350, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("video/BG3_crop.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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

};
