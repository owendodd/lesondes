import React from "react";
import { staticFile, Img } from "remotion";

// Background image is a full-frame screenshot from Figma (text baked in)
export interface IgStory113Props {
  durationSec?: number;
}

export function IgStory113({ durationSec: _d = 5 }: IgStory113Props) {
  return (
    <div style={{ width: 1080, height: 1920, position: "relative", overflow: "hidden", backgroundColor: "#fff" }}>
      <Img src={staticFile("images/IgStory113.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}
