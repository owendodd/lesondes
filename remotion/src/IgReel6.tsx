import React, { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender, Video } from "remotion";

const ARTISTS = [
  "Miriam Adefris",
  "Pierre Bastien",
  "CTM",
  "Lukas de Clerck",
  "Maya Dhondt",
  "Mats Erlandsson",
  "Josephine Foster",
  "Elisabeth Klinck",
  "Louis Laurain",
  "Lubomyr Melnyk",
  "Chantal Michelle",
  "Fredrik Rasten",
  "Mohammad Reza Mortazavi",
  "Youmna Saba",
];

export interface IgReel6Props {
  durationSec?: number;
}

export function IgReel6({ durationSec = 340 / 30 }: IgReel6Props) {
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));

  useEffect(() => {
    new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`,
      { weight: "400" }
    )
      .load()
      .then((face) => { document.fonts.add(face); continueRender(fontHandle); })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  return (
    <div style={{
      width: 1080, height: 1920,
      position: "relative", overflow: "hidden",
      backgroundColor: "#000",
      fontFamily: "ABCDiatype, sans-serif",
    }}>
      <Video
        src={staticFile("video/remotion/background5.mp4")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        muted
        loop
      />

      {/* Header: LES ONDES + Cerbère / dates — centered at y ≈ 356px */}
      <div style={{
        position: "absolute",
        left: "50%", top: "calc(50% - 604px)",
        transform: "translate(-50%, -50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 12,
      }}>
        <Strip><p style={{ ...textLg, whiteSpace: "pre" }}>{"LES ONDES     Cerbère"}</p></Strip>
        <Strip><p style={textLg}>May 29 30 31</p></Strip>
      </div>

      {/* Artists — centered at y ≈ 1040px */}
      <div style={{
        position: "absolute",
        left: "50%", top: "calc(50% + 80px)",
        transform: "translate(-50%, -50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 12,
      }}>
        {ARTISTS.map((name) => (
          <Strip key={name}><p style={textSm}>{name}</p></Strip>
        ))}
      </div>
    </div>
  );
}

function Strip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", display: "inline-flex", justifyContent: "center" }}>
      {children}
    </div>
  );
}

const textBase: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  lineHeight: 1,
  color: "rgba(0,0,0,0.9)",
  whiteSpace: "nowrap",
};

const textLg: React.CSSProperties = {
  ...textBase,
  fontSize: 100,
  letterSpacing: "-2px",
};

const textSm: React.CSSProperties = {
  ...textBase,
  fontSize: 60,
  letterSpacing: "-1.2px",
};
