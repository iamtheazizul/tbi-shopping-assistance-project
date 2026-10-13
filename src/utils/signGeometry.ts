import type { CSSProperties } from 'react';
import type { PhotoBox, SignCell, SignPhoto, SignSpec, Span } from '../types/sign';

export function absBox(sign: SignSpec, x: Span, y: Span): PhotoBox {
  return {
    x: sign.box.x + sign.box.w * x.from,
    y: sign.box.y + sign.box.h * y.from,
    w: sign.box.w * (x.to - x.from),
    h: sign.box.h * (y.to - y.from)
  };
}

/** "SNACK BARS" → "Snack bars", "Breads/Crumbs" → "Breads/Crumbs". */
export function displayWord(word: string): string {
  return word.
  split('/').
  map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).
  join('/');
}

/** Every readable piece on every sign: the aisle number, then each word cell. */
export function signCells(photo: SignPhoto): SignCell[] {
  return photo.signs.flatMap((sign, si) => {
    const cells: SignCell[] = [];
    if (sign.number && sign.aisle !== null) {
      cells.push({
        id: `${si}-n`,
        label: `Aisle ${sign.aisle}`,
        box: absBox(sign, sign.number.x, sign.number.y),
        signIndex: si,
        isNumber: true
      });
    }
    sign.rows.forEach((row, ri) =>
    sign.cols.forEach((col, ci) => {
      const text = sign.grid[ri]?.[ci];
      if (text) {
        cells.push({
          id: `${si}-${ri}-${ci}`,
          label: displayWord(text),
          box: absBox(sign, col, row),
          signIndex: si,
          isNumber: false
        });
      }
    })
    );
    return cells;
  });
}

/** Categories read left column first, top to bottom, like a person would. */
export function signCategories(sign: SignSpec): string[] {
  const out: string[] = [];
  sign.cols.forEach((_, ci) =>
  sign.rows.forEach((_, ri) => {
    const text = sign.grid[ri]?.[ci];
    if (text) out.push(displayWord(text));
  })
  );
  return out;
}

export function paddedUnion(boxes: PhotoBox[], pad = 3): PhotoBox {
  const x0 = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
  const y0 = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
  const x1 = Math.min(100, Math.max(...boxes.map((b) => b.x + b.w)) + pad);
  const y1 = Math.min(100, Math.max(...boxes.map((b) => b.y + b.h)) + pad);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export function centerInside(box: PhotoBox, outer: PhotoBox): boolean {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return cx >= outer.x && cx <= outer.x + outer.w && cy >= outer.y && cy <= outer.y + outer.h;
}

export function boxStyle(box: PhotoBox): CSSProperties {
  return { left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` };
}