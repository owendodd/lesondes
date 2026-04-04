import { SlideDef } from "./slides";
import { SLIDES } from "./slides";

// Slower, irregular charDelays — each line has its own target duration
// and lines with spaces get extra pause at each space for rhythm
function delay(text: string, targetMs: number): number {
  const nonSpace = [...text].filter((c) => c !== " " && c !== "\n").length;
  return Math.max(20, Math.round(targetMs / nonSpace));
}

const OVERLAP = -100;

export const STORY3_SLIDES: SlideDef[] = [
  // Slide 1: LES ONDES + Cerbère side by side
  {
    id: "s3-title",
    lines: [
      { id: "t-title",   text: "LES ONDES", charDelay: delay("LES ONDES", 900), typeOutCharDelay: 60, spaceExtra: 60, pauseAfter: 0, startDelay: 700 },
      { id: "t-cerbere", text: "Cerbère",    charDelay: delay("Cerbère",   750), typeOutCharDelay: 60, pauseAfter: 0 },
    ],
    nextOverlap: OVERLAP,
    typeOutDelay: 80,
  },
  // Slide 2: date
  {
    id: "s3-dates",
    lines: [{ id: "dates", text: "May 29 30 31", charDelay: delay("May 29 30 31", 1100), typeOutCharDelay: 60, spaceExtra: 80, pauseAfter: 0 }],
    nextOverlap: OVERLAP,
    typeOutDelay: 80,
  },
  // Artists — each with its own target so timing varies noticeably
  { id: "s3-a1", lines: [{ id: "a1", text: "Miriam Adefris",   charDelay: delay("Miriam Adefris",   800), spaceExtra: 55, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-a2", lines: [{ id: "a2", text: "Pierre Bastien",   charDelay: delay("Pierre Bastien",   650), spaceExtra: 40, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-a3", lines: [{ id: "a3", text: "Lukas de Clerck",  charDelay: delay("Lukas de Clerck",  950), spaceExtra: 70, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-a4", lines: [{ id: "a4", text: "Maya Dhondt",      charDelay: delay("Maya Dhondt",      700), spaceExtra: 50, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-a5", lines: [{ id: "a5", text: "Mats Erlandsson",  charDelay: delay("Mats Erlandsson",  850), spaceExtra: 65, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-a6", lines: [{ id: "a6", text: "Elisabeth Klinck", charDelay: delay("Elisabeth Klinck", 600), spaceExtra: 45, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-b1", lines: [{ id: "b1", text: "Louis Laurain",    charDelay: delay("Louis Laurain",    900), spaceExtra: 70, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-b2", lines: [{ id: "b2", text: "Lubomyr Melnyk",   charDelay: delay("Lubomyr Melnyk",   750), spaceExtra: 55, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-b3", lines: [{ id: "b3", text: "Chantal Michelle", charDelay: delay("Chantal Michelle", 1000), spaceExtra: 75, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-b4", lines: [{ id: "b4", text: "Mohammad Reza\nMortazavi", charDelay: delay("Mohammad Reza\nMortazavi", 850), pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-b5", lines: [{ id: "b5", text: "Fredrik Rasten",   charDelay: delay("Fredrik Rasten",   700), spaceExtra: 50, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "s3-b6", lines: [{ id: "b6", text: "Youmna Saba",      charDelay: delay("Youmna Saba",      800), spaceExtra: 60, pauseAfter: 0 }], nextOverlap: 0,       typeOutDelay: 80 },
];
