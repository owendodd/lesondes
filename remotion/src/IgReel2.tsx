import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";

// Rhythm: photo → 30f rest → text → 45f rest → next photo (5 slides)
const PHOTO_0    = 0;
const HEADER_1   = 30;
const HEADER_2   = 33;
const HEADER_3   = 36;
const PHOTO_1    = 81;   // 45f after last header
const TAGLINE    = 111;  // 30f after Photo 1
const PHOTO_A    = 156;  // 45f after tagline
const A_START    = 186;  // 30f after Photo A — 14 artists × 3f → last at 225
const PHOTO_B    = 270;  // 45f after last artist
const FOOD_1     = 300;  // 30f after Photo B
const FOOD_2     = 303;  // 3f after Food
const PHOTO_C    = 348;  // 45f after Wine
const FOOD_3     = 378;  // 30f after Photo C
const TOTAL      = 415;

export const igReel2FramesPerLoop = (_fps: number) => TOTAL;

const ARTIST_STAGGER = 3;

const IMG_SRCS = [
  "images/IgReel2bg.jpg",
  "images/IgReel2b.jpg",
  "images/IgReel2a.jpg",
  "images/IgReel2c.jpg",
  "images/IgReel1a.jpg",
];

export interface IgReel2Props {
  loops?: number;
}

const show = (frame: number, start: number): React.CSSProperties => ({
  opacity: frame >= start ? 1 : 0,
});

function Strip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: "white", display: "inline-block", ...style }}>
      {children}
    </div>
  );
}

export function IgReel2({ loops = 1 }: IgReel2Props) {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame % TOTAL;
  const [fontHandle] = useState(() => delayRender("Loading ABCDiatype fonts"));
  const [imgHandles] = useState(() =>
    IMG_SRCS.map((src) => ({ src, handle: delayRender(`img:${src}`) }))
  );

  useEffect(() => {
    new FontFace(
      "ABCDiatype",
      `url(${staticFile("fonts/ABCDiatype-Medium.woff2")})`,
      { weight: "400" }
    )
      .load()
      .then((face) => {
        document.fonts.add(face);
        continueRender(fontHandle);
      })
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  useEffect(() => {
    imgHandles.forEach(({ src, handle }) => {
      const img = new Image();
      img.src = staticFile(src);
      img.onload = () => continueRender(handle);
      img.onerror = () => continueRender(handle);
    });
  }, []);

  const artists = [
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
    "Mohammad Reza \nMortazavi",
    "Youmna Saba",
  ];

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "white",
        fontFamily: "ABCDiatype, sans-serif",
      }}
    >
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-igreel2" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── Slide 1: LES ONDES / Cerbère / May ── */}
      <Inset w={1080} h={1920} deg={0} style={show(frame, PHOTO_0)}>
        <img src={staticFile("images/IgReel2bg.jpg")} alt="" style={imgFill} />
      </Inset>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          width: 806,
        }}
      >
        <div style={show(frame, HEADER_1)}>
          <Strip><p style={textLg}>LES ONDES</p></Strip>
        </div>
        <div style={show(frame, HEADER_2)}>
          <Strip><p style={textLg}>Cerbère</p></Strip>
        </div>
        <div style={{ ...show(frame, HEADER_3), width: "100%" }}>
          <Strip style={{ width: "100%", textAlign: "center" }}>
            <p style={textLg}>May 29 30 31</p>
          </Strip>
        </div>
      </div>

      {/* ── Slide 2: 3 days of food, wine… ── */}
      <Inset w={1080} h={1920} deg={0} style={show(frame, PHOTO_1)}>
        <img src={staticFile("images/IgReel2b.jpg")} alt="" style={imgFill} />
      </Inset>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          ...show(frame, TAGLINE),
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Strip>
          <p style={textLg}>3 days of food, wine,</p>
          <p style={textLg}>and music by the sea</p>
        </Strip>
      </div>

      {/* ── Slide 3: Artists ── */}
      <Inset w={1080} h={1920} deg={0} style={show(frame, PHOTO_A)}>
        <img src={staticFile("images/IgReel2a.jpg")} alt="" style={imgFill} />
      </Inset>
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
          gap: 20,
        }}
      >
        {artists.map((name, i) => (
          <div key={name} style={show(frame, A_START + i * ARTIST_STAGGER)}>
            <Strip>
              <p style={{ ...textSm, whiteSpace: "pre-line" }}>{name}</p>
            </Strip>
          </div>
        ))}
      </div>

      {/* ── Slide 4: Food / Wine ── */}
      <Inset w={1080} h={1920} deg={0} style={show(frame, PHOTO_B)}>
        <img src={staticFile("images/IgReel2c.jpg")} alt="" style={imgFill} />
      </Inset>
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
        <div style={show(frame, FOOD_1)}>
          <Strip>
            <p style={textLg}>Food by</p>
            <p style={textLg}>Harry Lester</p>
          </Strip>
        </div>
        <div style={show(frame, FOOD_2)}>
          <Strip>
            <p style={textLg}>Wine selections</p>
            <p style={textLg}>by Clara Blum</p>
          </Strip>
        </div>
      </div>

      {/* ── Slide 5: Tickets ── */}
      <Inset w={1080} h={1920} deg={0} style={show(frame, PHOTO_C)}>
        <img src={staticFile("images/IgReel1a.jpg")} alt="" style={imgFill} />
      </Inset>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          ...show(frame, FOOD_3),
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Strip>
          <p style={textLg}>Tickets</p>
          <p style={textLg}>at les-ondes.fr</p>
        </Strip>
      </div>
    </div>
  );
}

function Inset({
  w, h, deg, style, children,
}: {
  w: number; h: number; deg: number; style?: React.CSSProperties; children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${deg}deg)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const imgFill: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const textBase: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  lineHeight: 1,
  color: "rgba(0, 0, 0, 0.9)",
  whiteSpace: "nowrap",
  textAlign: "center",
  filter: "url(#roughen-igreel2)",
};

const textLg: React.CSSProperties = {
  ...textBase,
  fontSize: 140,
  letterSpacing: "-2.8px",
};

const textSm: React.CSSProperties = {
  ...textBase,
  fontSize: 80,
  letterSpacing: "-1.6px",
};
