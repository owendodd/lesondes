import { SlideDef } from "./slides";

function delay(text: string, targetMs: number): number {
  const nonSpace = [...text].filter((c) => c !== " " && c !== "\n").length;
  return Math.max(20, Math.round(targetMs / nonSpace));
}

const OVERLAP = -100;

export const POST3_SLIDES: SlideDef[] = [
  // Slide 1: title + date combined, stacked vertically
  {
    id: "p3-header",
    direction: "column",
    lines: [
      { id: "p3-title",   text: "LES ONDES",    charDelay: delay("LES ONDES",    630), typeOutCharDelay: 50, spaceExtra: 50, pauseAfter: 0, startDelay: 500 },
      { id: "p3-cerbere", text: "Cerbère",       charDelay: delay("Cerbère",      525), typeOutCharDelay: 50, pauseAfter: 0 },
      { id: "p3-dates",   text: "May 29 30 31",  charDelay: delay("May 29 30 31", 770), typeOutCharDelay: 50, spaceExtra: 60, pauseAfter: 0 },
    ],
    nextOverlap: OVERLAP,
    typeOutDelay: 80,
  },
  // Artists — ~30% faster than STORY3_SLIDES
  { id: "p3-a1", lines: [{ id: "a1", text: "Miriam Adefris",   charDelay: delay("Miriam Adefris",   560), spaceExtra: 40, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-a2", lines: [{ id: "a2", text: "Pierre Bastien",   charDelay: delay("Pierre Bastien",   455), spaceExtra: 28, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-a3", lines: [{ id: "a3", text: "Lukas de Clerck",  charDelay: delay("Lukas de Clerck",  665), spaceExtra: 49, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-a4", lines: [{ id: "a4", text: "Maya Dhondt",      charDelay: delay("Maya Dhondt",      490), spaceExtra: 35, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-a5", lines: [{ id: "a5", text: "Mats Erlandsson",  charDelay: delay("Mats Erlandsson",  595), spaceExtra: 46, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-a6", lines: [{ id: "a6", text: "Elisabeth Klinck", charDelay: delay("Elisabeth Klinck", 420), spaceExtra: 32, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-b1", lines: [{ id: "b1", text: "Louis Laurain",    charDelay: delay("Louis Laurain",    630), spaceExtra: 49, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-b2", lines: [{ id: "b2", text: "Lubomyr Melnyk",   charDelay: delay("Lubomyr Melnyk",   525), spaceExtra: 39, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-b3", lines: [{ id: "b3", text: "Chantal Michelle", charDelay: delay("Chantal Michelle", 700), spaceExtra: 53, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-b4", lines: [{ id: "b4", text: "Mohammad Reza\nMortazavi", charDelay: delay("Mohammad Reza\nMortazavi", 595), pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-b5", lines: [{ id: "b5", text: "Fredrik Rasten",   charDelay: delay("Fredrik Rasten",   490), spaceExtra: 35, pauseAfter: 0 }], nextOverlap: OVERLAP, typeOutDelay: 80 },
  { id: "p3-b6", lines: [{ id: "b6", text: "Youmna Saba",      charDelay: delay("Youmna Saba",      560), spaceExtra: 42, pauseAfter: 0 }], nextOverlap: 0,       typeOutDelay: 80 },
];
