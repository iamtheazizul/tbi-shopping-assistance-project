const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        backdrop: '#DCE6F3',
        canvas: v('canvas'),
        card: v('card'),
        line: v('line'),
        ink: { DEFAULT: v('ink'), soft: v('ink-soft') },
        primary: { DEFAULT: v('primary'), edge: v('primary-edge'), soft: v('primary-soft') },
        'on-primary': v('on-primary'),
        sunny: v('sunny'),
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        helper: ['calc(var(--ts, 1) * 16px)', { lineHeight: '1.4' }],
        body: ['calc(var(--ts, 1) * 18px)', { lineHeight: '1.5' }],
        lead: ['calc(var(--ts, 1) * 21px)', { lineHeight: '1.4' }],
        title: ['calc(var(--ts, 1) * 28px)', { lineHeight: '1.2' }],
        item: ['calc(var(--ts, 1) * 32px)', { lineHeight: '1.15' }],
        area: ['calc(var(--ts, 1) * 44px)', { lineHeight: '1.05' }],
        'aisle-word': ['calc(var(--ts, 1) * 38px)', { lineHeight: '1' }],
        'aisle-sm': ['calc(var(--ts, 1) * 64px)', { lineHeight: '0.95' }],
        aisle: ['calc(var(--ts, 1) * 80px)', { lineHeight: '0.95' }],
      },
    },
  },
  plugins: [],
};
