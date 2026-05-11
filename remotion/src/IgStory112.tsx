import React, { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender, Img } from "remotion";

export interface IgStory112Props {
  durationSec?: number;
}

export function IgStory112({ durationSec: _d = 5 }: IgStory112Props) {
  const [fh] = useState(() => delayRender("font"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load().then(f => { document.fonts.add(f); continueRender(fh); })
      .catch(() => continueRender(fh));
  }, [fh]);

  return (
    <div style={outerStyle}>
      <Img src={staticFile("images/IgStory112.jpg")} style={bgStyle} />
      <div style={centerStack}>
        <Strip>
          <p style={body}>Food by</p>
          <p style={body}>Harry Lester</p>
        </Strip>
        <Strip>
          <p style={body}>Wine selections</p>
          <p style={body}>by Clara Blum</p>
        </Strip>
      </div>
    </div>
  );
}

function Strip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", paddingTop: 6, paddingBottom: 4, paddingLeft: 16, paddingRight: 16, display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      {children}
    </div>
  );
}

const outerStyle: React.CSSProperties = { width: 1080, height: 1920, position: "relative", overflow: "hidden", backgroundColor: "#000", fontFamily: "ABCDiatype, sans-serif" };
const bgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
const centerStack: React.CSSProperties = { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 };
const body: React.CSSProperties = { margin: 0, fontFamily: "ABCDiatype, sans-serif", fontWeight: 400, fontSize: 68, lineHeight: 1, letterSpacing: "-1.36px", color: "rgba(0,0,0,0.9)", textAlign: "center", whiteSpace: "nowrap" };
