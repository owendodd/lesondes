import React, { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender, Img } from "remotion";

export interface IgStory110Props {
  durationSec?: number;
}

export function IgStory110({ durationSec: _d = 5 }: IgStory110Props) {
  const [fh] = useState(() => delayRender("font"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load().then(f => { document.fonts.add(f); continueRender(fh); })
      .catch(() => continueRender(fh));
  }, [fh]);

  return (
    <div style={outerStyle}>
      <Img src={staticFile("images/IgStory110.jpg")} style={bgStyle} />
      <div style={centerStack}>
        <Strip><p style={{ ...title, whiteSpace: "pre" }}>{`LES ONDES    Cerbère`}</p></Strip>
        <Strip>
          <p style={title}>
            3 days of concerts, shared<br />meals, and wine by the sea
          </p>
        </Strip>
        <Strip><p style={title}>May 29 30 31</p></Strip>
      </div>
    </div>
  );
}

function Strip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", paddingTop: 6, paddingBottom: 4, paddingLeft: 16, paddingRight: 16, display: "inline-flex", justifyContent: "center" }}>
      {children}
    </div>
  );
}

const outerStyle: React.CSSProperties = { width: 1080, height: 1920, position: "relative", overflow: "hidden", backgroundColor: "#000", fontFamily: "ABCDiatype, sans-serif" };
const bgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
const centerStack: React.CSSProperties = { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 };
const title: React.CSSProperties = { margin: 0, fontFamily: "ABCDiatype, sans-serif", fontWeight: 400, fontSize: 72, lineHeight: 1, letterSpacing: "-1.44px", color: "rgba(0,0,0,0.9)", textAlign: "center", whiteSpace: "nowrap" };
