import { SlideDef } from "./slides";
import { SLIDES } from "./slides";

export const STORY_SLIDES: SlideDef[] = [
  // Slide 1: title, location, dates — reuse from IgPost
  SLIDES[0],
  // Slide 2: all 12 artists in a single list
  {
    id: "story-artists",
    nextOverlap: -700,
    typeOutDelay: -1200,
    lines: [
      { id: "s1",  text: "Miriam Adefris",          charDelay: 36, pauseAfter: 50 },
      { id: "s2",  text: "Pierre Bastien",           charDelay: 31, pauseAfter: 60 },
      { id: "s3",  text: "Lukas de Clerck",          charDelay: 38, pauseAfter: 50 },
      { id: "s4",  text: "Maya Dhondt",              charDelay: 29, pauseAfter: 70 },
      { id: "s5",  text: "Mats Erlandsson",          charDelay: 36, pauseAfter: 55 },
      { id: "s6",  text: "Elisabeth Klinck",         charDelay: 38, pauseAfter: 50 },
      { id: "s7",  text: "Louis Laurain",            charDelay: 34, pauseAfter: 55 },
      { id: "s8",  text: "Lubomyr Melnyk",           charDelay: 29, pauseAfter: 50 },
      { id: "s9",  text: "Chantal Michelle",         charDelay: 38, pauseAfter: 55 },
      { id: "s10", text: "Mohammad Reza\nMortazavi",  charDelay: 24, pauseAfter: 50 },
      { id: "s11", text: "Fredrik Rasten",           charDelay: 42, pauseAfter: 55 },
      { id: "s12", text: "Youmna Saba",              charDelay: 24, pauseAfter: 0  },
    ],
  },
];
