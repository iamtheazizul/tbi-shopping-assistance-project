import type { ThemeOption } from '../types/app';

export const themes: ThemeOption[] = [
{ id: 'pea', name: 'Pea', primary: '#2BD9A8', edge: '#1FB894', soft: '#DFFBF3', softDark: '#1C4A4D' },
{ id: 'ocean', name: 'Ocean', primary: '#5BC0FF', edge: '#2F9BE3', soft: '#E2F3FF', softDark: '#1E3F66' },
{ id: 'sunny', name: 'Sunny', primary: '#FFC94D', edge: '#E3A82A', soft: '#FFF3D3', softDark: '#4A4232' },
{ id: 'berry', name: 'Berry', primary: '#B99CFF', edge: '#9576EA', soft: '#EEE7FF', softDark: '#393466' }];


export const surfaces = {
  light: { canvas: '#F3F8FF', card: '#FFFFFF', line: '#E1EAF7', ink: '#172A45', inkSoft: '#5B6785' },
  dark: { canvas: '#172A45', card: '#1F3658', line: '#2D4769', ink: '#F1F6FF', inkSoft: '#AEB9D3' }
};

export const brand = { navy: '#172A45', sunny: '#FFC94D' };