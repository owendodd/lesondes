import React from "react";
import { Composition } from "remotion";
import { Ig1a, Ig1aProps, IG1A_SLIDES } from "./Ig1a";
import { Ig1b, Ig1bProps, IG1B_SLIDES } from "./Ig1b";
import { Ig2a, Ig2aProps } from "./Ig2a";
import { Ig2b, Ig2bProps } from "./Ig2b";
import { Ig3a, Ig3aProps, IG3A_SLIDES } from "./Ig3a";
import { Ig3b, Ig3bProps, IG3B_SLIDES } from "./Ig3b";
import { Announce1, Announce1Props, ANNOUNCE1_SLIDES } from "./Announce1";
import { Announce2, Announce2Props, ANNOUNCE2_SLIDES } from "./Announce2";
import { Announce2b, Announce2bProps } from "./Announce2b";
import { Announce3, Announce3Props, ANNOUNCE3_SLIDES } from "./Announce3";
import { AnnounceBg, AnnounceBgProps } from "./AnnounceBg";
import { IgDj1, IgDj1Props, igDj1FramesPerRotation } from "./IgDj1";
import { IgReel1, IgReel1Props, igReel1FramesPerLoop } from "./IgReel1";
import { IgReel2, IgReel2Props, igReel2FramesPerLoop } from "./IgReel2";
import { IgReel3, IgReel3Props, igReel3FramesPerLoop } from "./IgReel3";
import { IgReel4, IgReel4Props, igReel4FramesPerLoop } from "./IgReel4";
import { IgReel5, IgReel5Props, igReel5FramesPerLoop } from "./IgReel5";
import { IgDj2, IgDj2Props, igDj2FramesPerRotation } from "./IgDj2";
import { IgDj3, IgDj3Props, igDj3FramesPerRotation } from "./IgDj3";
import { IgReel6, IgReel6Props } from "./IgReel6";
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
        id="Announce-2b"
        component={Announce2b}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 1 } satisfies Announce2bProps}
        calculateMetadata={({ props }) => {
          const loops = props.loops ?? 1;
          const durationInFrames = Math.ceil(computeTotalMs(loops, ANNOUNCE2_SLIDES) / (1000 / FPS));
          return { durationInFrames, props };
        }}
      />
      <Composition
        id="Announce-Bg"
        component={AnnounceBg}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ durationSec: 10 } satisfies AnnounceBgProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props.durationSec ?? 10) * FPS,
          props,
        })}
      />
      <Composition
        id="Ig-Dj1"
        component={IgDj1}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 2 } satisfies IgDj1Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igDj1FramesPerRotation(FPS), props };
        }}
      />
      <Composition
        id="Ig-Dj2"
        component={IgDj2}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 2 } satisfies IgDj2Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igDj2FramesPerRotation(FPS), props };
        }}
      />
      <Composition
        id="Ig-Dj3"
        component={IgDj3}
        fps={FPS}
        width={2160}
        height={2700}
        defaultProps={{ loops: 2 } satisfies IgDj3Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igDj3FramesPerRotation(FPS), props };
        }}
      />
      <Composition
        id="Ig-Reel-2"
        component={IgReel2}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ loops: 1 } satisfies IgReel2Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igReel2FramesPerLoop(FPS), props };
        }}
      />
      <Composition
        id="Ig-Reel-3"
        component={IgReel3}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ loops: 1 } satisfies IgReel3Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igReel3FramesPerLoop(FPS), props };
        }}
      />
      <Composition
        id="Ig-Reel-1"
        component={IgReel1}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ loops: 1 } satisfies IgReel1Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igReel1FramesPerLoop(FPS), props };
        }}
      />
      <Composition
        id="Ig-Reel-5"
        component={IgReel5}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ loops: 1 } satisfies IgReel5Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igReel5FramesPerLoop(FPS), props };
        }}
      />
      <Composition
        id="Ig-Reel-4"
        component={IgReel4}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ loops: 1 } satisfies IgReel4Props}
        calculateMetadata={({ props }) => {
          const loops = Number(props.loops ?? 1);
          return { durationInFrames: loops * igReel4FramesPerLoop(FPS), props };
        }}
      />
      <Composition
        id="Ig-Reel-6"
        component={IgReel6}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ durationSec: 340 / 30 } satisfies IgReel6Props}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil((props.durationSec ?? 340 / 30) * FPS),
          props,
        })}
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
