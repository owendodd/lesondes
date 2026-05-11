import React, { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender, OffthreadVideo } from "remotion";

export interface IgStory116Props {
  durationSec?: number;
}

export function IgStory116({ durationSec: _d = 10 }: IgStory116Props) {
  const [fh] = useState(() => delayRender("font"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load().then(f => { document.fonts.add(f); continueRender(fh); })
      .catch(() => continueRender(fh));
  }, [fh]);

  return (
    <div style={outerStyle}>
      <OffthreadVideo src={staticFile("video/remotion/background3.mov")} style={bgStyle} muted playbackRate={0.8} />
      <div style={centerStack}>
        <Strip><p style={title}>Getting there<br />from Barcelona</p></Strip>
        <Strip>
          <p style={body}>
            Daily trains from Barcelona-Sants<br />to Portbou (direct, 2.5 hours)<br />
            <span style={it}>10min drive / taxi / shuttle</span>
          </p>
        </Strip>
        <Strip><p style={body}>Drive  (~2.5 hours)</p></Strip>
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
const centerStack: React.CSSProperties = { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 };
const base: React.CSSProperties = { margin: 0, fontFamily: "ABCDiatype, sans-serif", fontWeight: 400, lineHeight: 1.1, color: "rgba(0,0,0,0.9)", whiteSpace: "nowrap", textAlign: "center" };
const title: React.CSSProperties = { ...base, fontSize: 72, letterSpacing: "-1.44px" };
const body: React.CSSProperties = { ...base, fontSize: 56, letterSpacing: "-1.12px" };
const it: React.CSSProperties = { fontStyle: "italic" };
