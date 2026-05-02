import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  staticFile,
  delayRender,
  continueRender,
  interpolate,
  Easing,
} from "remotion";

// ── Timings (frames @ 25fps) ──────────────────────────────────────────────────
const PHOTO_DUR    = 30;

// Text slides: roll-up entrance + reading hold
const INFO_DUR     = 62;
const ARTISTS_DUR  = 55;
const FOODWINE_DUR = 65;

const REVEAL = 7;   // frames per line reveal (expo easing)
const LG_H   = 120; // textLg line height
const SM_H   = 60;  // textSm line height

// ── Slide types ───────────────────────────────────────────────────────────────
type Slide =
  | { type: "info";     dur: number }
  | { type: "artists";  dur: number }
  | { type: "foodwine"; dur: number }
  | { type: "photo"; src: string; dur: number };

const SLIDES: Slide[] = [
  { type: "photo",    src: "images/IgReel2bg.jpg", dur: PHOTO_DUR },
  { type: "info",                                  dur: INFO_DUR },
  { type: "photo",    src: "images/IgReel2a.jpg",  dur: PHOTO_DUR },
  { type: "artists",                               dur: ARTISTS_DUR },
  { type: "photo",    src: "images/IgReel2c.jpg",  dur: PHOTO_DUR },
  { type: "foodwine",                              dur: FOODWINE_DUR },
];

const TOTAL = SLIDES.reduce((s, sl) => s + sl.dur, 0);

const IMG_SRCS = SLIDES
  .filter((s): s is Extract<Slide, { type: "photo" }> => s.type === "photo")
  .map((s) => s.src);

export const igReel3FramesPerLoop = (_fps: number) => TOTAL;
export interface IgReel3Props { loops?: number }

function findSlide(frame: number): { slide: Slide; localFrame: number } {
  let acc = 0;
  for (const slide of SLIDES) {
    if (frame < acc + slide.dur) return { slide, localFrame: frame - acc };
    acc += slide.dur;
  }
  const last = SLIDES[SLIDES.length - 1];
  return { slide: last, localFrame: last.dur - 1 };
}

// ── Reveal primitive ──────────────────────────────────────────────────────────
function Reveal({ f, at, h, children }: {
  f: number; at: number; h: number; children: React.ReactNode;
}) {
  const t = interpolate(f, [at, at + REVEAL], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  return (
    <div style={{ overflow: "hidden", height: h }}>
      <div style={{ transform: `translateY(${(1 - t) * 110}%)` }}>
        {children}
      </div>
    </div>
  );
}

// ── Artists ───────────────────────────────────────────────────────────────────
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

// ── Root ──────────────────────────────────────────────────────────────────────
export function IgReel3({ loops = 1 }: IgReel3Props) {
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
      .then((face) => { document.fonts.add(face); continueRender(fontHandle); })
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

  const { slide, localFrame } = findSlide(frame);

  return (
    <div style={{
      width: 1080, height: 1920,
      position: "relative", overflow: "hidden",
      backgroundColor: "#fff",
      fontFamily: "ABCDiatype, sans-serif",
    }}>
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-igreel3" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {slide.type === "photo" && (
        <img
          src={staticFile(slide.src)}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {slide.type === "info"     && <SlideInfo     f={localFrame} />}
      {slide.type === "artists"  && <SlideArtists  f={localFrame} />}
      {slide.type === "foodwine" && <SlideFoodWine f={localFrame} />}
    </div>
  );
}

// ── Slides ────────────────────────────────────────────────────────────────────
function SlideInfo({ f }: { f: number }) {
  return (
    <div style={{
      position: "absolute",
      left: 137, top: "50%",
      transform: "translateY(-50%)",
      width: 806,
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 320, textAlign: "center",
    }}>
      <div>
        <Reveal f={f} at={0}  h={LG_H}><p style={textLg}>LES ONDES</p></Reveal>
        <Reveal f={f} at={4}  h={LG_H}><p style={textLg}>Cerbère</p></Reveal>
        <Reveal f={f} at={8}  h={LG_H}><p style={textLg}>May 29 30 31</p></Reveal>
      </div>
      <div>
        <Reveal f={f} at={22} h={SM_H}><p style={textSm}>3 days of food,</p></Reveal>
        <Reveal f={f} at={26} h={SM_H}><p style={textSm}>wine, and music</p></Reveal>
        <Reveal f={f} at={30} h={SM_H}><p style={textSm}>by the sea</p></Reveal>
      </div>
    </div>
  );
}

function SlideArtists({ f }: { f: number }) {
  return (
    <div style={{
      position: "absolute",
      left: "50%", top: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 20, textAlign: "center",
    }}>
      {ARTISTS.map((name, i) => (
        <Reveal key={name} f={f} at={i * 2} h={name.includes("\n") ? SM_H * 2 : SM_H}>
          <p style={{ ...textSm, whiteSpace: name.includes("\n") ? "pre" : "nowrap" }}>
            {name}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

function SlideFoodWine({ f }: { f: number }) {
  return (
    <div style={{
      position: "absolute",
      left: "50%", top: "50%",
      transform: "translate(-50%, -50%)",
      width: 1040,
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 320, textAlign: "center",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 160 }}>
        <div>
          <Reveal f={f} at={0}  h={LG_H}><p style={textLg}>Food by</p></Reveal>
          <Reveal f={f} at={4}  h={LG_H}><p style={textLg}>Harry Lester</p></Reveal>
        </div>
        <div>
          <Reveal f={f} at={14} h={LG_H}><p style={textLg}>Wine selections</p></Reveal>
          <Reveal f={f} at={18} h={LG_H}><p style={textLg}>by Clara Blum</p></Reveal>
        </div>
      </div>
      <div>
        <Reveal f={f} at={32} h={SM_H}><p style={textSm}>Tickets available</p></Reveal>
        <Reveal f={f} at={36} h={SM_H}><p style={textSm}>at les-ondes.fr</p></Reveal>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const textBase: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  lineHeight: 1,
  color: "rgba(0, 0, 0, 0.9)",
  filter: "url(#roughen-igreel3)",
};

const textLg: React.CSSProperties = {
  ...textBase,
  fontSize: 120,
  letterSpacing: "-2.4px",
  whiteSpace: "nowrap",
};

const textSm: React.CSSProperties = {
  ...textBase,
  fontSize: 60,
  letterSpacing: "3.2px",
  whiteSpace: "nowrap",
};
