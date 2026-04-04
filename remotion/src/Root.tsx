import React from "react";
import { Composition } from "remotion";
import { IgPost, IgPostProps } from "./IgPost";
import { IgPost2, IgPost2Props } from "./IgPost2";
import { IgPost3, IgPost3Props } from "./IgPost3";
import { IgStory, IgStoryProps } from "./IgStory";
import { IgStory2, IgStory2Props } from "./IgStory2";
import { IgStory3, IgStory3Props } from "./IgStory3";
import { IgPat1, IgPat1Props } from "./IgPat1";
import { IgPat2, IgPat2Props } from "./IgPat2";
import { IgStory4, IgStory4Props } from "./IgStory4";
import { IgFinalA, IgFinalAProps } from "./IgFinalA";
import { IgFinalB, IgFinalBProps } from "./IgFinalB";
import { IgFinalC, IgFinalCProps } from "./IgFinalC";
import { IgFinalD, IgFinalDProps } from "./IgFinalD";
import { EmailHeader, EmailHeaderProps } from "./EmailHeader";
import { EmailFooter, EmailFooterProps, EMAIL_SLIDES } from "./EmailFooter";
import { STORY3_SLIDES } from "./story3-slides";
import { STORY4_SLIDES } from "./story4-slides";
import { POST3_SLIDES } from "./post3-slides";
import { FINAL_A_SLIDES, FINAL_C_SLIDES, FINAL_D_SLIDES } from "./final-slides";
import { computeTotalMs, computeStayTotalMs } from "./timeline";

const FPS = 25;

export function Root() {
  return (
    <>
      <Composition
        id="IgPost"
        component={IgPost}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ loops: 1 } satisfies IgPostProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgStory"
        component={IgStory}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ durationSec: 10 } satisfies IgStoryProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 10) * FPS,
          props,
        })}
      />
      <Composition
        id="IgPost2"
        component={IgPost2}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ durationSec: 22 } satisfies IgPost2Props}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 22) * FPS,
          props,
        })}
      />
      <Composition
        id="IgPost3"
        component={IgPost3}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ loops: 1 } satisfies IgPost3Props}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, POST3_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgStory3"
        component={IgStory3}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ loops: 1 } satisfies IgStory3Props}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, STORY3_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgPat1"
        component={IgPat1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ loops: 1 } satisfies IgPat1Props}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, STORY3_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgPat2"
        component={IgPat2}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{} satisfies IgPat2Props}
        calculateMetadata={() => ({
          durationInFrames: Math.ceil(computeStayTotalMs(STORY3_SLIDES, 1.6, 2000) / (1000 / FPS)),
          props: {},
        })}
      />
      <Composition
        id="IgStory4"
        component={IgStory4}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ loops: 1 } satisfies IgStory4Props}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, STORY4_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgFinalA"
        component={IgFinalA}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ loops: 1 } satisfies IgFinalAProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, FINAL_A_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgFinalB"
        component={IgFinalB}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ durationSec: 30 } satisfies IgFinalBProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 30) * FPS,
          props,
        })}
      />
      <Composition
        id="IgFinalC"
        component={IgFinalC}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ loops: 1 } satisfies IgFinalCProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, FINAL_C_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgFinalD"
        component={IgFinalD}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ loops: 1 } satisfies IgFinalDProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, FINAL_D_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="EmailHeader"
        component={EmailHeader}
        fps={FPS}
        width={1000}
        height={469}
        defaultProps={{ durationSec: 10 } satisfies EmailHeaderProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 10) * FPS,
          props,
        })}
      />
      <Composition
        id="EmailFooter"
        component={EmailFooter}
        fps={FPS}
        width={1000}
        height={469}
        defaultProps={{ loops: 1 } satisfies EmailFooterProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, EMAIL_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="IgStory2"
        component={IgStory2}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ durationSec: 30 } satisfies IgStory2Props}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 30) * FPS,
          props,
        })}
      />
    </>
  );
}
