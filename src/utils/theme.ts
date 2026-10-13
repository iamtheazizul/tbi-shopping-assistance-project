import { brand, surfaces, themes } from '../data/themes';
import type { ThemeId } from '../types/app';

export function themeVars(themeId: ThemeId, dark: boolean): Record<string, string> {
  const theme = themes.find((t) => t.id === themeId) ?? themes[0];
  const s = dark ? surfaces.dark : surfaces.light;
  return {
    '--c-canvas': hexToRgb(s.canvas),
    '--c-card': hexToRgb(s.card),
    '--c-line': hexToRgb(s.line),
    '--c-ink': hexToRgb(s.ink),
    '--c-ink-soft': hexToRgb(s.inkSoft),
    '--c-primary': hexToRgb(theme.primary),
    '--c-primary-edge': hexToRgb(theme.edge),
    '--c-primary-soft': hexToRgb(dark ? theme.softDark : theme.soft),
    '--c-on-primary': hexToRgb(brand.navy),
    '--c-sunny': hexToRgb(brand.sunny)
  };
}

function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${n >> 16 & 255} ${n >> 8 & 255} ${n & 255}`;
}