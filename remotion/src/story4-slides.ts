import { SlideDef } from "./slides";

function delay(text: string, targetMs: number): number {
  const nonSpace = [...text].filter((c) => c !== " " && c !== "\n").length;
  return Math.max(20, Math.round(targetMs / nonSpace));
}

const OVERLAP = -100;

export const STORY4_SLIDES: SlideDef[] = [
  // Slide 1: LES ONDES + Cerbère side by side
  {
    id: "s4-title",
    direction: "row",
    lines: [
      { id: "s4-title-main", text: "LES ONDES", charDelay: delay("LES ONDES", 900), typeOutCharDelay: 60, spaceExtra: 60, pauseAfter: 0, startDelay: 700 },
      { id: "s4-title-sub",  text: "Cerbère",   charDelay: delay("Cerbère",   750), typeOutCharDelay: 60, pauseAfter: 0 },
    ],
    nextOverlap: OVERLAP,
    typeOutDelay: 80,
  },
  // Slide 2: dates
  {
    id: "s4-dates",
    direction: "column",
    lines: [{ id: "s4-dates-line", text: "May 29 30 31", charDelay: delay("May 29 30 31", 1100), typeOutCharDelay: 60, spaceExtra: 80, pauseAfter: 0 }],
    nextOverlap: OVERLAP,
    typeOutDelay: 80,
  },
  // Slide 3: all artists in one slide, vertical stack
  {
    id: "s4-artists",
    direction: "column",
    lines: [
      { id: "s4-a1", text: "Miriam Adefris",          charDelay: delay("Miriam Adefris",          550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-a2", text: "Pierre Bastien",           charDelay: delay("Pierre Bastien",           550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-a3", text: "Lukas de Clerck",          charDelay: delay("Lukas de Clerck",          550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-a4", text: "Maya Dhondt",              charDelay: delay("Maya Dhondt",              550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-a5", text: "Mats Erlandsson",          charDelay: delay("Mats Erlandsson",          550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-a6", text: "Elisabeth Klinck",         charDelay: delay("Elisabeth Klinck",         550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-b1", text: "Louis Laurain",            charDelay: delay("Louis Laurain",            550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-b2", text: "Lubomyr Melnyk",           charDelay: delay("Lubomyr Melnyk",           550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-b3", text: "Chantal Michelle",         charDelay: delay("Chantal Michelle",         550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-b4", text: "Mohammad Reza\nMortazavi", charDelay: delay("Mohammad Reza\nMortazavi", 550), pauseAfter: 0 },
      { id: "s4-b5", text: "Fredrik Rasten",           charDelay: delay("Fredrik Rasten",           550), spaceExtra: 35, pauseAfter: 0 },
      { id: "s4-b6", text: "Youmna Saba",              charDelay: delay("Youmna Saba",              550), spaceExtra: 35, pauseAfter: 0 },
    ],
    nextOverlap: 0,
    typeOutDelay: -2000,
  },
];
