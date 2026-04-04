import React from "react";
import { Composition } from "remotion";
import { Ig1a, Ig1aProps, IG1A_SLIDES } from "./Ig1a";
import { Ig1b, Ig1bProps, IG1B_SLIDES } from "./Ig1b";
import { Ig2a, Ig2aProps } from "./Ig2a";
import { Ig2b, Ig2bProps } from "./Ig2b";
import { Ig3a, Ig3aProps, IG3A_SLIDES } from "./Ig3a";
import { Ig3b, Ig3bProps, IG3B_SLIDES } from "./Ig3b";
import { computeTotalMs } from "./timeline";

const FPS = 25;

export function Root() {
  return (
    <>
      <Composition
        id="Ig-1a"
        component={Ig1a}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Ig1aProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, IG1A_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="Ig-1b"
        component={Ig1b}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Ig1bProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, IG1B_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="Ig-2a"
        component={Ig2a}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ durationSec: 15 } satisfies Ig2aProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 15) * FPS,
          props,
        })}
      />
      <Composition
        id="Ig-2b"
        component={Ig2b}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ durationSec: 15 } satisfies Ig2bProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 15) * FPS,
          props,
        })}
      />
      <Composition
        id="Ig-3a"
        component={Ig3a}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Ig3aProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, IG3A_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="Ig-3b"
        component={Ig3b}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Ig3bProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, IG3B_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
    </>
  );
}
