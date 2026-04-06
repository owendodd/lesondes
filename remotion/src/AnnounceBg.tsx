import React from "react";
import { OffthreadVideo, staticFile } from "remotion";

// ── Props ──────────────────────────────────────────────────────────────────────
export interface AnnounceBgProps {
  durationSec?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function AnnounceBg({ durationSec = 10 }: AnnounceBgProps) {
  return (
    <div style={{ width: 2160, height: 2700, position: "relative", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("video/BG3_slow.mp4")}
        playbackRate={1.25}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
