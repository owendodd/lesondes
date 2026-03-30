import React from "react";
import { Composition } from "remotion";
import { IgAnimation, IgAnimationProps } from "./IgAnimation";
import { computeTotalMs } from "./timeline";

const FPS = 25;

export function Root() {
  return (
    <Composition
      id="IgAnimation"
      component={IgAnimation}
      fps={FPS}
      width={1080}
      height={1350}
      // Default: 1 cycle. Override with --props='{"loops":3}' at render time.
      defaultProps={{ loops: 1 } satisfies IgAnimationProps}
      calculateMetadata={({ props }) => {
        const loops = props.loops ?? 1;
        const durationInFrames = Math.ceil(computeTotalMs(loops) / (1000 / FPS));
        return { durationInFrames, props };
      }}
    />
  );
}
