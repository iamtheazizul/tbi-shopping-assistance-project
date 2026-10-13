import React, { useRef } from 'react';
import { boxStyle } from '../../utils/signGeometry';
import type { PhotoBox } from '../../types/sign';

type Handle = 'move' | 'nw' | 'ne' | 'sw' | 'se';

interface AdjustBoxProps {
  box: PhotoBox;
  onChange: (box: PhotoBox) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const MIN = 8;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function AdjustBox({ box, onChange, containerRef }: AdjustBoxProps) {
  const drag = useRef<{handle: Handle;px: number;py: number;start: PhotoBox;} | null>(null);

  const begin = (handle: Handle) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { handle, px: e.clientX, py: e.clientY, start: box };
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    const dx = (e.clientX - d.px) / rect.width * 100;
    const dy = (e.clientY - d.py) / rect.height * 100;
    const s = d.start;
    let { x, y, w, h } = s;
    if (d.handle === 'move') {
      x = clamp(s.x + dx, 0, 100 - s.w);
      y = clamp(s.y + dy, 0, 100 - s.h);
    }
    if (d.handle === 'nw' || d.handle === 'sw') {
      x = clamp(s.x + dx, 0, s.x + s.w - MIN);
      w = s.w + (s.x - x);
    }
    if (d.handle === 'ne' || d.handle === 'se') w = clamp(s.w + dx, MIN, 100 - s.x);
    if (d.handle === 'nw' || d.handle === 'ne') {
      y = clamp(s.y + dy, 0, s.y + s.h - MIN);
      h = s.h + (s.y - y);
    }
    if (d.handle === 'sw' || d.handle === 'se') h = clamp(s.h + dy, MIN, 100 - s.y);
    onChange({ x, y, w, h });
  };

  const end = () => {
    drag.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 2;
    const keys: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const delta = keys[e.key];
    if (!delta) return;
    e.preventDefault();
    if (e.shiftKey) {
      onChange({ ...box, w: clamp(box.w + delta[0], MIN, 100 - box.x), h: clamp(box.h + delta[1], MIN, 100 - box.y) });
    } else {
      onChange({ ...box, x: clamp(box.x + delta[0], 0, 100 - box.w), y: clamp(box.y + delta[1], 0, 100 - box.h) });
    }
  };

  const handles: {id: Handle;className: string;}[] = [
  { id: 'nw', className: '-left-4 -top-4 cursor-nwse-resize' },
  { id: 'ne', className: '-right-4 -top-4 cursor-nesw-resize' },
  { id: 'sw', className: '-bottom-4 -left-4 cursor-nesw-resize' },
  { id: 'se', className: '-bottom-4 -right-4 cursor-nwse-resize' }];


  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Sign box. Drag to move it, drag a corner to resize. Arrow keys move it, Shift and arrows resize it."
      onPointerDown={begin('move')}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={onKeyDown}
      style={boxStyle(box)}
      className="absolute cursor-move touch-none rounded-xl border-[3px] border-primary shadow-[0_0_0_9999px_rgba(12,22,40,0.45)]">
      
      {handles.map((h) =>
      <span
        key={h.id}
        aria-hidden
        onPointerDown={begin(h.id)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className={`absolute flex h-8 w-8 touch-none items-center justify-center ${h.className}`}>
        
          <span className="h-5 w-5 rounded-full border-[3px] border-white bg-primary" />
        </span>
      )}
    </div>);

}