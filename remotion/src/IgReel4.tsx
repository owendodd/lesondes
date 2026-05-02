import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  staticFile,
  delayRender,
  continueRender,
  Img,
} from "remotion";

const TEXT_DUR  = 50;
const PHOTO_DUR = 25;

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
  "Mohammad Reza\nMortazavi",
  "Youmna Saba",
];

type Slide =
  | { type: "title";   dur: number }
  | { type: "info";    dur: number }
  | { type: "artists"; dur: number }
  | { type: "tickets"; dur: number }
  | { type: "photo"; src: string; dur: number };

const SLIDES: Slide[] = [
  { type: "title",   dur: TEXT_DUR },
  { type: "photo",   src: "images/IgReel2bg.jpg", dur: PHOTO_DUR },
  { type: "info",    dur: TEXT_DUR },
  { type: "photo",   src: "images/IgReel2a.jpg",  dur: PHOTO_DUR },
  { type: "artists", dur: TEXT_DUR },
  { type: "photo",   src: "images/IgReel2c.jpg",  dur: PHOTO_DUR },
  { type: "tickets", dur: TEXT_DUR },
  { type: "photo",   src: "images/IgReel2b.jpg",  dur: PHOTO_DUR },
];

const TOTAL = SLIDES.reduce((s, sl) => s + sl.dur, 0);

export const igReel4FramesPerLoop = (_fps: number) => TOTAL;

export interface IgReel4Props {
  loops?: number;
}

function findSlide(frame: number): Slide {
  let acc = 0;
  for (const slide of SLIDES) {
    if (frame < acc + slide.dur) return slide;
    acc += slide.dur;
  }
  return SLIDES[SLIDES.length - 1];
}

export function IgReel4({ loops = 1 }: IgReel4Props) {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame % TOTAL;
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

  const slide = findSlide(frame);

  return (
    <div style={{
      width: 1080, height: 1920,
      position: "relative", overflow: "hidden",
      backgroundColor: "#fff",
      fontFamily: "ABCDiatype, sans-serif",
    }}>
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-igreel4" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {slide.type === "photo" && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Img
            src={staticFile(slide.src)}
            alt=""
            style={{ width: 920, height: 1226, objectFit: "cover", display: "block" }}
          />
        </div>
      )}
      {slide.type === "title"   && <SlideTitle />}
      {slide.type === "info"    && <SlideInfo />}
      {slide.type === "artists" && <SlideArtists />}
      {slide.type === "tickets" && <SlideTickets />}
    </div>
  );
}

function SlideTitle() {
  return (
    <div style={{ ...centered, gap: 60 }}>
      <p style={textLg}>LES ONDES</p>
      <p style={textLg}>Cerbère</p>
      <p style={textLg}>May 29 30 31</p>
    </div>
  );
}

function SlideInfo() {
  return (
    <div style={{ ...centered, gap: 60 }}>
      <div style={{ textAlign: "center" }}>
        <p style={textSm}>3 days of experimental</p>
        <p style={textSm}>music by the sea</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={textSm}>Food by</p>
        <p style={textSm}>Harry Lester</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={textSm}>Wine selections</p>
        <p style={textSm}>by Clara Blum</p>
      </div>
    </div>
  );
}

function SlideArtists() {
  return (
    <div style={{ ...centered, gap: 30 }}>
      {ARTISTS.map((name) => (
        <p
          key={name}
          style={{ ...textSm, whiteSpace: name.includes("\n") ? "pre" : "nowrap" }}
        >
          {name}
        </p>
      ))}
    </div>
  );
}

function SlideTickets() {
  return (
    <div style={{ ...centered, gap: 60 }}>
      <p style={textLg}>Tickets available</p>
      <p style={textLg}>les-ondes.fr</p>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const centered: React.CSSProperties = {
  position: "absolute", left: "50%", top: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex", flexDirection: "column", alignItems: "center",
  textAlign: "center",
};

const textBase: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  lineHeight: 1,
  color: "rgba(0,0,0,0.9)",
  filter: "url(#roughen-igreel4)",
};

const textLg: React.CSSProperties = {
  ...textBase,
  fontSize: 120,
  letterSpacing: "-2.4px",
  whiteSpace: "nowrap",
};

const textSm: React.CSSProperties = {
  ...textBase,
  fontSize: 72,
  letterSpacing: "-1.44px",
  whiteSpace: "nowrap",
};
