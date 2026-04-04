import React from "react";
import { Video, staticFile } from "remotion";

export interface IgFinalBProps {
  durationSec?: number;
}

export function IgFinalB(_props: IgFinalBProps) {
  return (
    <div style={{ width: 1080, height: 1350, overflow: "hidden", position: "relative" }}>
      <Video
        src={staticFile("video/BG3_slow.mp4")}
        loop
        playbackRate={1.1}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
