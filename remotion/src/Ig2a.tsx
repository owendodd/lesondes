import React, { useEffect, useState } from "react";
import { OffthreadVideo, staticFile, delayRender, continueRender } from "remotion";

export interface Ig2aProps {
  durationSec?: number;
}

const ARTISTS = [
  "Miriam Adefris",
  "Pierre Bastien",
  "CTM",
  "Lukas de Clerck",
  "Maya Dhondt",
  "Mats Erlandsson",
  "Elisabeth Klinck",
  "Louis Laurain",
  "Molly Lewis",
  "Lubomyr Melnyk",
  "Chantal Michelle",
  "Mohammad Reza\nMortazavi",
  "Fredrik Rasten",
  "Youmna Saba",
];

export function Ig2a(_props: Ig2aProps) {
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load()
      .then((face) => { document.fonts.add(face); continueRender(fontHandle); })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  return (
    <div style={{ width: 2160, height: 2700, background: "#fff", position: "relative", overflow: "hidden" }}>


      {/* Upper half: video full bleed */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 2160, height: 1350, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("video/BG3_crop.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Lower half: artist list comma-separated */}
      <div
        style={{
          position: "absolute",
          top: 1350,
          left: 0,
          width: 2160,
          height: 1350,
          display: "flex",
          alignItems: "flex-start",
          boxSizing: "border-box",
          padding: 160,
        }}
      >
        <p style={textStyle}>
          {ARTISTS.map((name, i) => (
            <React.Fragment key={i}>
              <span style={{ whiteSpace: "nowrap" }}>{name.replace("\n", " ")}</span>
              {i < ARTISTS.length - 1 ? ", " : ""}
            </React.Fragment>
          ))}
        </p>
      </div>

    </div>
  );
}

const textStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  color: "#000",
  fontSize: 110,
  lineHeight: 1.1,
  letterSpacing: "0.02em",
  textAlign: "center",
  whiteSpace: "normal",

};
