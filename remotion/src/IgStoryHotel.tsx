import React, { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender, Img } from "remotion";

export interface IgStoryHotelProps {
  name?: string;
  location?: string;
  imagePath?: string;
  durationSec?: number;
}

export function IgStoryHotel({ name = "", location = "", imagePath = "", durationSec: _d = 5 }: IgStoryHotelProps) {
  const [fh] = useState(() => delayRender("font"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load().then(f => { document.fonts.add(f); continueRender(fh); })
      .catch(() => continueRender(fh));
  }, [fh]);

  return (
    <div style={outerStyle}>
      {/* Hotel photo — centered at 50%/50% of frame */}
      <div style={imageContainer}>
        <Img src={staticFile(imagePath)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Hotel name */}
      <p style={{ ...nameStyle, top: 1294.51 }}>{name}</p>

      {/* Location — italic */}
      <p style={{ ...nameStyle, top: 1356.51, fontStyle: "italic" }}>{location}</p>
    </div>
  );
}

const outerStyle: React.CSSProperties = { width: 1080, height: 1920, position: "relative", overflow: "hidden", backgroundColor: "#fff", fontFamily: "ABCDiatype, sans-serif" };
const imageContainer: React.CSSProperties = { position: "absolute", width: 676, height: 541, left: "50%", top: "50%", transform: "translate(-50%, -50%)", overflow: "hidden" };
const nameStyle: React.CSSProperties = { position: "absolute", left: "50%", transform: "translateX(-50%)", margin: 0, fontFamily: "ABCDiatype, sans-serif", fontWeight: 400, fontSize: 56, lineHeight: 1.1, letterSpacing: "-1.12px", color: "rgba(0,0,0,0.9)", whiteSpace: "nowrap", textAlign: "center" };
