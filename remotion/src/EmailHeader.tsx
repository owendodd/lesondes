import React from "react";
import { Video, staticFile } from "remotion";

export interface EmailHeaderProps {
  durationSec?: number;
}

export function EmailHeader(_props: EmailHeaderProps) {
  return (
    <div style={{ width: 1000, height: 469, overflow: "hidden", position: "relative" }}>
      <Video
        src={staticFile("video/BG3_slow.mp4")}
        loop
        playbackRate={0.6}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
