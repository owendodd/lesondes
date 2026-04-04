import { SlideDef } from "./slides";

function delay(text: string, targetMs: number): number {
  const nonSpace = [...text].filter((c) => c !== " " && c !== "\n").length;
  return Math.max(20, Math.round(targetMs / nonSpace));
}

// ── IgFinalA: title + date as one looping slide ───────────────────────────────
export const FINAL_A_SLIDES: SlideDef[] = [
  {
    id: "fa-header",
    direction: "column",
    lines: [
      { id: "fa-title",   text: "LES ONDES",   charDelay: delay("LES ONDES",   700), typeOutCharDelay: 45, spaceExtra: 55, pauseAfter: 0, startDelay: 500 },
      { id: "fa-cerbere", text: "Cerbère",      charDelay: delay("Cerbère",     580), typeOutCharDelay: 45, pauseAfter: 0 },
      { id: "fa-dates",   text: "May 29 30 31", charDelay: delay("May 29 30 31", 850), typeOutCharDelay: 45, spaceExtra: 65, pauseAfter: 0 },
    ],
    nextOverlap: -100,
    typeOutDelay: 600,
  },
];

// ── IgFinalD: food + wine info, two slides ────────────────────────────────────
const OVERLAP = -100;

export const FINAL_D_SLIDES: SlideDef[] = [
  {
    id: "fd-info",
    direction: "column",
    lines: [
      { id: "fd-food1", text: "Food from Harry Lester",      charDelay: delay("Food from Harry Lester",      750), typeOutCharDelay: 45, spaceExtra: 45, pauseAfter: 0, startDelay: 400 },
      { id: "fd-food2", text: "Comptoir Central des Bazars", charDelay: delay("Comptoir Central des Bazars", 900), typeOutCharDelay: 45, spaceExtra: 50, pauseAfter: 0 },
      { id: "fd-wine1", text: "Wine selections by",          charDelay: delay("Wine selections by",          650), typeOutCharDelay: 45, spaceExtra: 45, pauseAfter: 0 },
      { id: "fd-wine2", text: "Clara Blum",                  charDelay: delay("Clara Blum",                  450), typeOutCharDelay: 45, pauseAfter: 0 },
    ],
    nextOverlap: 0,
    typeOutDelay: 600,
  },
];

// ── IgFinalC: all artists as one looping slide ────────────────────────────────
export const FINAL_C_SLIDES: SlideDef[] = [
  {
    id: "fc-artists",
    direction: "column",
    lines: [
      { id: "fc-a1", text: "Miriam Adefris",          charDelay: delay("Miriam Adefris",          550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0, startDelay: 200 },
      { id: "fc-a2", text: "Pierre Bastien",           charDelay: delay("Pierre Bastien",           550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-a3", text: "Lukas de Clerck",          charDelay: delay("Lukas de Clerck",          550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-a4", text: "Maya Dhondt",              charDelay: delay("Maya Dhondt",              550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-a5", text: "Mats Erlandsson",          charDelay: delay("Mats Erlandsson",          550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-a6", text: "Elisabeth Klinck",         charDelay: delay("Elisabeth Klinck",         550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-b1", text: "Louis Laurain",            charDelay: delay("Louis Laurain",            550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-b2", text: "Lubomyr Melnyk",           charDelay: delay("Lubomyr Melnyk",           550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-b3", text: "Chantal Michelle",         charDelay: delay("Chantal Michelle",         550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-b4", text: "Mohammad Reza\nMortazavi", charDelay: delay("Mohammad Reza\nMortazavi", 550), typeOutCharDelay: 45, pauseAfter: 0 },
      { id: "fc-b5", text: "Fredrik Rasten",           charDelay: delay("Fredrik Rasten",           550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
      { id: "fc-b6", text: "Youmna Saba",              charDelay: delay("Youmna Saba",              550), typeOutCharDelay: 45, spaceExtra: 35, pauseAfter: 0 },
    ],
    nextOverlap: -100,
    typeOutDelay: -2000,
  },
];
