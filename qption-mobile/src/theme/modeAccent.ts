export type TradingMode = 'real' | 'demo' | 'bonus' | string | undefined;

type AccentPalette = {
     primary: string; // default text
     strong: string;  // emphasized text
     soft: string;    // softer/accented hover/active
};

const MODE_ACCENTS: Record<'real' | 'demo' | 'bonus', AccentPalette> = {
     real: {
          primary: '#7EA7FF',
          strong: '#4D6AD9',
          soft: '#B9D1FF',
     },
     demo: {
          primary: '#7AC9D9',
          strong: '#49A3B5',
          soft: '#B8E6EE',
     },
     bonus: {
          primary: '#8FE3B6',
          strong: '#66D19E',
          soft: '#C5F3DF',
     },
};

export const getModeAccent = (mode: TradingMode): AccentPalette => {
     if (mode === 'demo') return MODE_ACCENTS.demo;
     if (mode === 'bonus') return MODE_ACCENTS.bonus;
     return MODE_ACCENTS.real;
};

export const hexToRgba = (hex: string, alpha: number): string => {
     const normalized = hex.replace('#', '');
     if (normalized.length !== 6) return hex;

     const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
     const a = clamp(alpha, 0, 1);

     const r = parseInt(normalized.slice(0, 2), 16);
     const g = parseInt(normalized.slice(2, 4), 16);
     const b = parseInt(normalized.slice(4, 6), 16);

     if ([r, g, b].some((v) => Number.isNaN(v))) return hex;
     return `rgba(${r}, ${g}, ${b}, ${a})`;
};
