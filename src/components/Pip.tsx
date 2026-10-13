import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useShouldReduceMotion } from '../hooks/useShouldReduceMotion';
import type { PipMood } from '../types/app';

const NAVY = '#172A45';
const BODY = '#2CD9A8';
const SHADE = '#1FB894';
const LEAF = '#149670';
const CHEEK = '#FFAE9C';
const TONGUE = '#FF8FA3';

const blinkingMoods: PipMood[] = ['happy', 'excited', 'confused'];

const moodLabel: Record<PipMood, string> = {
  happy: 'Pip, smiling',
  excited: 'Pip, looking excited',
  squinting: 'Pip, squinting to read',
  confused: 'Pip, looking puzzled',
  sleepy: 'Pip, sleepy',
  celebrating: 'Pip, celebrating with arms up'
};

interface PipProps {
  mood?: PipMood;
  size?: number;
  bounce?: boolean;
  decorative?: boolean;
  className?: string;
}

export function Pip({ mood = 'happy', size = 96, bounce = false, decorative = false, className = '' }: PipProps) {
  const reduce = useShouldReduceMotion();
  const blink = useBlink(!reduce && blinkingMoods.includes(mood));
  const move = bounce && !reduce;

  const motionProps = !move ?
  {} :
  mood === 'celebrating' ?
  {
    animate: { y: [0, -16, 0] },
    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' as const }
  } :
  {
    animate: { y: [0, -7, 0] },
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const }
  };

  return (
    <motion.div className={`inline-block ${className}`} {...motionProps}>
      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 120 132"
        role={decorative ? undefined : 'img'}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : moodLabel[mood]}>
        
        {mood === 'celebrating' &&
        <g>
            <path d="M16 84 Q4 68 9 50" stroke={SHADE} strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M104 84 Q116 68 111 50" stroke={SHADE} strokeWidth="7" strokeLinecap="round" fill="none" />
            <circle cx="9" cy="49" r="5.5" fill={BODY} />
            <circle cx="111" cy="49" r="5.5" fill={BODY} />
          </g>
        }
        <path d="M60 33 C60 23 58 15 53 9" stroke={LEAF} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M56 13 C63 4 80 0 93 5 C83 14 68 18 56 13 Z" fill={LEAF} />
        <circle cx="60" cy="80" r="48" fill={SHADE} />
        <ellipse cx="60" cy="75" rx="47" ry="43" fill={BODY} />
        <ellipse cx="40" cy="55" rx="10" ry="6.5" transform="rotate(-25 40 55)" fill="#A0F0DA" />
        <ellipse cx="33" cy="92" rx="7" ry="4" fill={CHEEK} />
        <ellipse cx="87" cy="92" rx="7" ry="4" fill={CHEEK} />
        <Face mood={mood} blink={blink} />
        {mood === 'sleepy' &&
        <g fill="#5B6785" fontWeight={800} fontFamily="Nunito, sans-serif">
            <text x="94" y="36" fontSize="15">z</text>
            <text x="104" y="24" fontSize="11">z</text>
          </g>
        }
      </svg>
    </motion.div>);

}

function Face({ mood, blink }: {mood: PipMood;blink: boolean;}) {
  const stroke = { stroke: NAVY, strokeWidth: 4, strokeLinecap: 'round' as const, fill: 'none' };

  switch (mood) {
    case 'excited':
      return (
        <>
          <OpenEyes big blink={blink} />
          <OpenMouth />
        </>);

    case 'squinting':
      return (
        <>
          <path d="M38 71 L53 75" {...stroke} strokeWidth={3.5} />
          <path d="M82 71 L67 75" {...stroke} strokeWidth={3.5} />
          <path d="M39 81 Q46 77 53 81" {...stroke} />
          <path d="M67 81 Q74 77 81 81" {...stroke} />
          <path d="M53 97 Q60 95 67 97" {...stroke} strokeWidth={3.5} />
        </>);

    case 'confused':
      return (
        <>
          <path d="M39 68 L53 69" {...stroke} strokeWidth={3.5} />
          <path d="M67 64 Q74 57 81 62" {...stroke} strokeWidth={3.5} />
          <OpenEyes blink={blink} />
          <path d="M49 97 Q53 93 57 97 Q61 101 65 97 Q69 93 72 96" {...stroke} strokeWidth={3.5} />
        </>);

    case 'sleepy':
      return (
        <>
          <path d="M39 79 Q46 84 53 79" {...stroke} />
          <path d="M67 79 Q74 84 81 79" {...stroke} />
          <ellipse cx="60" cy="97" rx="3.5" ry="4" fill={NAVY} />
        </>);

    case 'celebrating':
      return (
        <>
          <path d="M39 82 Q46 74 53 82" {...stroke} />
          <path d="M67 82 Q74 74 81 82" {...stroke} />
          <OpenMouth />
        </>);

    default:
      return (
        <>
          <OpenEyes blink={blink} />
          <path d="M52 94 Q60 101 68 94" {...stroke} />
        </>);

  }
}

function OpenEyes({ big = false, blink }: {big?: boolean;blink: boolean;}) {
  if (blink) {
    return (
      <>
        <path d="M40 80 L52 80" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
        <path d="M68 80 L80 80" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
      </>);

  }
  const rx = big ? 7.5 : 6.5;
  const ry = big ? 10 : 8.5;
  return (
    <>
      <ellipse cx="46" cy="80" rx={rx} ry={ry} fill={NAVY} />
      <ellipse cx="74" cy="80" rx={rx} ry={ry} fill={NAVY} />
      <circle cx="48" cy="76" r={big ? 2.8 : 2.3} fill="#FFFFFF" />
      <circle cx="76" cy="76" r={big ? 2.8 : 2.3} fill="#FFFFFF" />
      {big &&
      <>
          <circle cx="44" cy="84" r="1.2" fill="#FFFFFF" />
          <circle cx="72" cy="84" r="1.2" fill="#FFFFFF" />
        </>
      }
    </>);

}

function OpenMouth() {
  return (
    <>
      <path d="M49 91 Q60 108 71 91 Z" fill={NAVY} />
      <path d="M54.5 99 Q60 104 65.5 99 Q60 96 54.5 99 Z" fill={TONGUE} />
    </>);

}

function useBlink(enabled: boolean): boolean {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let wait: number | undefined;
    let open: number | undefined;
    const schedule = () => {
      wait = window.setTimeout(() => {
        setClosed(true);
        open = window.setTimeout(() => {
          setClosed(false);
          schedule();
        }, 140);
      }, 2800 + Math.random() * 2200);
    };
    schedule();
    return () => {
      window.clearTimeout(wait);
      window.clearTimeout(open);
    };
  }, [enabled]);

  return enabled && closed;
}