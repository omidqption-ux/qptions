// svgClocks.tsx
import React from 'react';
import { SvgXml } from 'react-native-svg';

const noTimeSvgBuy = `
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="Navy/40"
    stroke="#4ccb90"
    stroke-width="2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 1h6v2H9zm4 7v2.17l6.98 6.98C20.63 15.91 21 14.5 21 13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-1.5 0-2.91.37-4.15 1.02L10.83 8zM2.81 2.81 1.39 4.22l3.4 3.4C3.67 9.12 3 10.98 3 13c0 4.97 4.02 9 9 9 2.02 0 3.88-.67 5.38-1.79l2.4 2.4 1.41-1.41z"></path>
  </svg>
`.trim();

const noTimeSvgSell = `
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="Navy/40"
    stroke="#ff6666"
    stroke-width="2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 1h6v2H9zm4 7v2.17l6.98 6.98C20.63 15.91 21 14.5 21 13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-1.5 0-2.91.37-4.15 1.02L10.83 8zM2.81 2.81 1.39 4.22l3.4 3.4C3.67 9.12 3 10.98 3 13c0 4.97 4.02 9 9 9 2.02 0 3.88-.67 5.38-1.79l2.4 2.4 1.41-1.41z"></path>
  </svg>
`.trim();

const rawClockSvg = `
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="Navy/40"
    stroke="#364E6E"
    stroke-width="2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 1h6v2H9z"/>
    <path d="M19.03 7.39l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61"/>
  </svg>
`.trim();

// If you *really* want data URIs as strings (e.g. for some lib), you can still keep these:
const prevEncodedSvg = encodeURIComponent(rawClockSvg);
const encodedClockSvgBuy = encodeURIComponent(noTimeSvgBuy);
const encodedClockSvgSell = encodeURIComponent(noTimeSvgSell);

export const prevClockSvgUri: string = `data:image/svg+xml;utf8,${prevEncodedSvg}`;
export const clockNoTimeSvgUriBuy: string = `data:image/svg+xml;utf8,${encodedClockSvgBuy}`;
export const clockNoTimeSvgUriSell: string = `data:image/svg+xml;utf8,${encodedClockSvgSell}`;

// 🔹 Recommended way: ready-to-use RN components with react-native-svg

export const ClockNoTimeBuy: React.FC<{ size?: number }> = ({ size = 48 }) => (
     <SvgXml xml={noTimeSvgBuy} width={size} height={size} />
);

export const ClockNoTimeSell: React.FC<{ size?: number }> = ({ size = 48 }) => (
     <SvgXml xml={noTimeSvgSell} width={size} height={size} />
);

export const ClockPrev: React.FC<{ size?: number }> = ({ size = 48 }) => (
     <SvgXml xml={rawClockSvg} width={size} height={size} />
);

// Also export raw XML strings in case you need them somewhere else
export { noTimeSvgBuy, noTimeSvgSell, rawClockSvg };
