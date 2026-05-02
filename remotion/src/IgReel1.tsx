import React, { useEffect, useState } from "react";
import {
  useCurrentFrame,
  staticFile,
  delayRender,
  continueRender,
  interpolate,
  Easing,
} from "remotion";

// All durations in frames at 25fps
const PHOTO_DUR = 30;   // 1.2s — quick flash
const ANIM_DUR = 7;     // entrance animation length per item

type Slide =
  | { type: "image"; src: string; dur: number }
  | { type: "info"; dur: number }
  | { type: "artists"; names: string[]; dur: number }
  | { type: "foodwine"; dur: number };

const ARTISTS_1 = [
  "Miriam Adefris",
  "Pierre Bastien",
  "CTM",
  "Lukas de Clerck",
  "Maya Dhondt",
  "Mats Erlandsson",
  "Josephine Foster",
];

const ARTISTS_2 = [
  "Elisabeth Klinck",
  "Louis Laurain",
  "Lubomyr Melnyk",
  "Chantal Michelle",
  "Fredrik Rasten",
  "Mohammad Reza\nMortazavi",
  "Youmna Saba",
];

const SLIDES: Slide[] = [
  { type: "image", src: "images/IgReel1a.jpg", dur: PHOTO_DUR },
  { type: "info", dur: 85 },
  { type: "image", src: "images/IgReel1b.jpg", dur: PHOTO_DUR },
  { type: "artists", names: ARTISTS_1, dur: 75 },
  { type: "image", src: "images/IgReel1c.jpg", dur: PHOTO_DUR },
  { type: "artists", names: ARTISTS_2, dur: 75 },
  { type: "image", src: "images/IgReel1d.jpg", dur: PHOTO_DUR },
  { type: "foodwine", dur: 85 },
];

const TOTAL_FRAMES = SLIDES.reduce((s, sl) => s + sl.dur, 0);

const IMG_SRCS = SLIDES
  .filter((s): s is Extract<Slide, { type: "image" }> => s.type === "image")
  .map((s) => s.src);

export const igReel1FramesPerLoop = (_fps: number) => TOTAL_FRAMES;

export interface IgReel1Props {
  loops?: number;
}

function findSlide(loopedFrame: number): { slide: Slide; localFrame: number } {
  let acc = 0;
  for (const slide of SLIDES) {
    if (loopedFrame < acc + slide.dur) {
      return { slide, localFrame: loopedFrame - acc };
    }
    acc += slide.dur;
  }
  const last = SLIDES[SLIDES.length - 1];
  return { slide: last, localFrame: last.dur - 1 };
}

// Returns opacity + translateY style for a staggered entrance
function pop(localFrame: number, delay: number): React.CSSProperties {
  const t = interpolate(localFrame, [delay, delay + ANIM_DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: t,
    transform: `translateY(${28 * (1 - t)}px)`,
  };
}

export function IgReel1({ loops = 1 }: IgReel1Props) {
  const frame = useCurrentFrame();
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

  const { slide, localFrame } = findSlide(frame % TOTAL_FRAMES);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
        fontFamily: "ABCDiatype, sans-serif",
      }}
    >
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="roughen-igreel1" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {slide.type === "image" && (
        <img
          src={staticFile(slide.src)}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      )}
      {slide.type === "info" && <SlideInfo localFrame={localFrame} />}
      {slide.type === "artists" && (
        <SlideArtists names={slide.names} localFrame={localFrame} />
      )}
      {slide.type === "foodwine" && <SlideFoodWine localFrame={localFrame} />}
    </div>
  );
}

function SlideInfo({ localFrame }: { localFrame: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 869,
        display: "flex",
        flexDirection: "column",
        gap: 100,
        textAlign: "center",
      }}
    >
      <div style={pop(localFrame, 0)}>
        <p style={text}>LES ONDES</p>
        <p style={text}>Cerbère</p>
      </div>
      <div style={pop(localFrame, 20)}>
        <p style={text}>3 days of food,</p>
        <p style={text}>wine and music</p>
      </div>
      <div style={pop(localFrame, 40)}>
        <p style={text}>Tickets at</p>
        <p style={text}>les-ondes.fr</p>
      </div>
    </div>
  );
}

function SlideArtists({ names, localFrame }: { names: string[]; localFrame: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 50,
        textAlign: "center",
      }}
    >
      {names.map((name, i) => (
        <p
          key={name}
          style={{ ...text, ...pop(localFrame, i * 7), whiteSpace: "pre-line" }}
        >
          {name}
        </p>
      ))}
    </div>
  );
}

function SlideFoodWine({ localFrame }: { localFrame: number }) {
  const groups: [string, string][] = [
    ["Food by", "Harry Lester"],
    ["Wine selections", "by Clara Blum"],
    ["Tickets at", "les-ondes.fr"],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 497,
        width: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 100,
        textAlign: "center",
      }}
    >
      {groups.map(([line1, line2], i) => (
        <div key={line1} style={pop(localFrame, i * 22)}>
          <p style={text}>{line1}</p>
          <p style={text}>{line2}</p>
        </div>
      ))}
    </div>
  );
}

const text: React.CSSProperties = {
  margin: 0,
  fontFamily: "ABCDiatype, sans-serif",
  fontWeight: 400,
  fontSize: 120,
  lineHeight: 1,
  letterSpacing: "-2.4px",
  color: "rgba(0, 0, 0, 0.9)",
  filter: "url(#roughen-igreel1)",
};
