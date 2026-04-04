/**
 * lib.dom (TS 5.9+) types FontFaceSet without Set-like mutators; browsers still
 * implement add/delete/clear per CSS Font Loading / MDN.
 */
export {};

declare global {
  interface FontFaceSet {
    add(font: FontFace): FontFaceSet;
    delete(font: FontFace): boolean;
    clear(): void;
  }
}
