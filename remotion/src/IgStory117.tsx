import React, { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender, OffthreadVideo } from "remotion";

export interface IgStory117Props {
  durationSec?: number;
}

export function IgStory117({ durationSec: _d = 10 }: IgStory117Props) {
  const [fh] = useState(() => delayRender("font"));
  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load().then(f => { document.fonts.add(f); continueRender(fh); })
      .catch(() => continueRender(fh));
  }, [fh]);

  return (
    <div style={outerStyle}>
      <OffthreadVideo src={staticFile("video/remotion/background5.mp4")} style={bgStyle} muted playbackRate={0.8} />
      <div style={centerStack}>
        <Strip><p style={title}>Tickets</p></Strip>
        <Strip>
          <p style={body}>3 days of concerts: 160€<br />With meals*: 360€</p>
        </Strip>
        <Strip>
          <p style={body}>Friday concerts: 60€<br />With meals*: 120€</p>
        </Strip>
        <Strip>
          <p style={body}>Saturday concerts: 80€<br />With meals*: 180€</p>
        </Strip>
        <Strip>
          <p style={body}>Sunday concerts: 60€<br />With meals*: 120€</p>
        </Strip>
        <Strip><p style={small}>*wine included</p></Strip>
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
const small: React.CSSProperties = { ...base, fontSize: 40, letterSpacing: "-0.8px" };
