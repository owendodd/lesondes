import React, { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender, Img } from "remotion";

export interface IgStory118Props {
  durationSec?: number;
}

export function IgStory118({ durationSec: _d = 5 }: IgStory118Props) {
  const [fh] = useState(() => delayRender("font"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load().then(f => { document.fonts.add(f); continueRender(fh); })
      .catch(() => continueRender(fh));
  }, [fh]);

  return (
    <div style={outerStyle}>
      <Img src={staticFile("images/IgStory118bg.png")} style={bgStyle} />
      <div style={centerLabel}>
        <div style={{ backgroundColor: "white", paddingTop: 6, paddingBottom: 4, paddingLeft: 16, paddingRight: 16 }}>
          <p style={titleStyle}>Where to stay</p>
        </div>
      </div>
    </div>
  );
}

const outerStyle: React.CSSProperties = { width: 1080, height: 1920, position: "relative", overflow: "hidden", backgroundColor: "#fff", fontFamily: "ABCDiatype, sans-serif" };
const bgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
const centerLabel: React.CSSProperties = { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", justifyContent: "center" };
const titleStyle: React.CSSProperties = { margin: 0, fontFamily: "ABCDiatype, sans-serif", fontWeight: 400, fontSize: 72, lineHeight: 1.1, letterSpacing: "-1.44px", color: "rgba(0,0,0,0.9)", whiteSpace: "nowrap", textAlign: "center" };
