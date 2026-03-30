export interface LineDef {
  id: string;
  text: string;
  charDelay: number;
  spaceExtra?: number;
  pauseAfter: number;
  startDelay?: number;
}

export interface SlideDef {
  id: string;
  lines: LineDef[];
  nextOverlap: number;
}

export const SLIDES: SlideDef[] = [
  {
    id: "slide-1",
    nextOverlap: -1000,
    lines: [
      { id: "t-title",   text: "LES ONDES",   charDelay: 70, pauseAfter: 60, startDelay: 1000 },
      { id: "t-cerbere", text: "Cerbère",      charDelay: 53, pauseAfter: 60 },
      { id: "dates",     text: "May 29 30 31", charDelay: 43, spaceExtra: 53, pauseAfter: 0 },
    ],
  },
  {
    id: "slide-2",
    nextOverlap: -1500,
    lines: [
      { id: "a1", text: "Miriam Adefris",   charDelay: 36, pauseAfter: 72  },
      { id: "a2", text: "Pierre Bastien",   charDelay: 31, pauseAfter: 90  },
      { id: "a3", text: "Lukas de Clerck",  charDelay: 41, pauseAfter: 62  },
      { id: "a4", text: "Maya Dhondt",      charDelay: 29, pauseAfter: 108 },
      { id: "a5", text: "Mats Erlandsson",  charDelay: 38, pauseAfter: 82  },
      { id: "a6", text: "Elisabeth Klinck", charDelay: 41, pauseAfter: 0   },
    ],
  },
  {
    id: "slide-3",
    nextOverlap: -700,
    lines: [
      { id: "b1", text: "Louis Laurain",           charDelay: 34, pauseAfter: 82  },
      { id: "b2", text: "Lubomyr Melnyk",          charDelay: 29, pauseAfter: 62  },
      { id: "b3", text: "Chantal Michelle",        charDelay: 40, pauseAfter: 90  },
      { id: "b4", text: "Mohammad Reza Mortazavi", charDelay: 26, pauseAfter: 72  },
      { id: "b5", text: "Fredrik Rasten",          charDelay: 46, pauseAfter: 82  },
      { id: "b6", text: "Youmna Saba",             charDelay: 24, pauseAfter: 0   },
    ],
  },
];
