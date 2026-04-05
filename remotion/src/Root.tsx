import React from "react";
import { Composition } from "remotion";
import { Announce1, Announce1Props, ANNOUNCE1_SLIDES } from "./Announce1";
import { Announce2, Announce2Props, ANNOUNCE2_SLIDES } from "./Announce2";
import { Announce3, Announce3Props, ANNOUNCE3_SLIDES } from "./Announce3";
import { computeTotalMs } from "./timeline";

const FPS = 25;

export function Root() {
  return (
    <>
      <Composition
        id="Announce-1"
        component={Announce1}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Announce1Props}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, ANNOUNCE1_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="Announce-2"
        component={Announce2}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Announce2Props}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, ANNOUNCE2_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="Announce-3"
        component={Announce3}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Announce3Props}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, ANNOUNCE3_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
    </>
  );
}
