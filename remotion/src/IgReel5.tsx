import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  staticFile,
  delayRender,
  continueRender,
  OffthreadVideo,
} from "remotion";

// ── Timing (frames @ 25fps) ─────────────────────────────────────────────────
// Item i appears at GROUP_START + i*Sx, disappears at GROUP_END + i*Sx

const GAP = 22; // frames between last hide of one group and first appear of next

// Per-group stagger (Sx) and hold (frames fully visible after last item appears)
const SH = 4; const HOLD_H = 48; // slide 1 — slower in/out
const SI = 2; const HOLD_I = 65; // slide 2 — normal speed, longer pause
const SA = 2; const HOLD_A = 65; // slide 3 — longer pause on artists
const ST = 4; const HOLD_T = 48; // slide 4 — slower in/out

const H1    = 24;
const H_END = H1 + 2*SH + HOLD_H;              // H3 hides at H_END + 2*SH = 88

const I1    = H_END + 2*SH + GAP;              // = 110
const I_END = I1 + 2*SI + HOLD_I;              // I3 hides at I_END + 2*SI = 183

const A_START = I_END + 2*SI + GAP;            // = 205; last artist at 231
const A_END   = A_START + 13*SA + HOLD_A;      // artist 13 hides at A_END + 13*SA = 305

const T1    = A_END + 13*SA + GAP;             // = 327
const T_END = T1 + ST + HOLD_T;                // T2 hides at T_END + ST = 383

const TOTAL = 415;

export const igReel5FramesPerLoop = (_fps: number) => TOTAL;

export interface IgReel5Props {
  loops?: number;
}

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

function vis(frame: number, start: number, end = Infinity): React.CSSProperties {
  return { opacity: frame >= start && frame < end ? 1 : 0 };
}

function Strip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: "white", display: "inline-block", ...style }}>
      {children}
    </div>
  );
}

export function IgReel5({ loops = 1 }: IgReel5Props) {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame % TOTAL;
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));

  useEffect(() => {
    new FontFace("ABCDiatype", `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`, { weight: "400" })
      .load()
      .then((face) => { document.fonts.add(face); continueRender(fontHandle); })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "black",
        fontFamily: "ABCDiatype, sans-serif",
      }}
    >
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-igreel5" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Video background — always playing */}
      <OffthreadVideo
        src={staticFile("video/remotion/background6.mov")}
        playbackRate={13.938 / (TOTAL / 25)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* ── Slide 1: Header ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        <div style={vis(frame, H1,        H_END)}>
          <Strip><p style={textLg}>LES ONDES</p></Strip>
        </div>
        <div style={vis(frame, H1 + SH,   H_END + SH)}>
          <Strip><p style={textLg}>Cerbère</p></Strip>
        </div>
        <div style={vis(frame, H1 + 2*SH, H_END + 2*SH)}>
          <Strip><p style={textLg}>May 29 30 31</p></Strip>
        </div>
      </div>

      {/* ── Slide 2: Info ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        <div style={vis(frame, I1,        I_END)}>
          <Strip>
            <p style={textSm}>3 days of experimental</p>
            <p style={textSm}>music by the sea</p>
          </Strip>
        </div>
        <div style={vis(frame, I1 + SI,   I_END + SI)}>
          <Strip>
            <p style={textSm}>Food by</p>
            <p style={textSm}>Harry Lester</p>
          </Strip>
        </div>
        <div style={vis(frame, I1 + 2*SI, I_END + 2*SI)}>
          <Strip>
            <p style={textSm}>Wine selections</p>
            <p style={textSm}>by Clara Blum</p>
          </Strip>
        </div>
      </div>

      {/* ── Slide 3: Artists ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          padding: "0 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {ARTISTS.map((name, i) => (
          <div key={name} style={vis(frame, A_START + i * SA, A_END + i * SA)}>
            <Strip>
              <p style={{ ...textSm, whiteSpace: "pre-line" }}>{name}</p>
            </Strip>
          </div>
        ))}
      </div>

      {/* ── Slide 4: Tickets ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        <div style={vis(frame, T1,      T_END)}>
          <Strip><p style={textLg}>Tickets available</p></Strip>
        </div>
        <div style={vis(frame, T1 + ST, T_END + ST)}>
          <Strip><p style={textLg}>les-ondes.fr</p></Strip>
        </div>
      </div>
    </div>
  );
}

const textBase: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  lineHeight: 1,
  color: "rgba(0, 0, 0, 0.9)",
  whiteSpace: "nowrap",
  textAlign: "center",
  filter: "url(#roughen-igreel5)",
};

const textLg: React.CSSProperties = {
  ...textBase,
  fontSize: 120,
  letterSpacing: "-2.4px",
};

const textSm: React.CSSProperties = {
  ...textBase,
  fontSize: 72,
  letterSpacing: "-1.44px",
};
