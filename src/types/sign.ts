import type { PipMood } from './app';

/** A rectangle in percent of the photo's width and height. */
export interface PhotoBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A range as a fraction (0–1) of a sign's width or height. */
export interface Span {
  from: number;
  to: number;
}

export interface SignSpec {
  aisle: number | null;
  box: PhotoBox;
  number?: {x: Span;y: Span;};
  cols: Span[];
  rows: Span[];
  /** Words laid out as grid[row][col], exactly as they appear on the sign. */
  grid: (string | null)[][];
  guesses: string[];
}

export type SignOutcome = 'success' | 'question' | 'multi' | 'noNumber' | 'unreadable';
export type Confidence = 'very' | 'kinda' | 'guessing';
export type SignPhotoId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface SignPhoto {
  id: SignPhotoId;
  url: string;
  alt: string;
  signs: SignSpec[];
  outcome: SignOutcome;
  confidence: Confidence;
  mood: PipMood;
  message: {calm: string;cheerful: string;goofy: string;};
}

export interface SignCell {
  id: string;
  label: string;
  box: PhotoBox;
  signIndex: number;
  isNumber: boolean;
}