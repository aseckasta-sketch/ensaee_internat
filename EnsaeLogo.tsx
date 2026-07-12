/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface EnsaeLogoProps {
  className?: string;
  size?: number;
}

export default function EnsaeLogo({ className = '', size = 48 }: EnsaeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`${className} flex-shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer border (thick blue line) */}
      <rect x="2" y="2" width="116" height="116" rx="2" stroke="#005ca9" strokeWidth="2.5" fill="#ffffff" />
      
      {/* Inner thin border (separated by white gap) */}
      <rect x="6" y="6" width="108" height="108" rx="1" stroke="#005ca9" strokeWidth="1" fill="none" />
      
      {/* Horizontal divider line separating the chart from the 'ensae' text */}
      <line x1="6" y1="84" x2="114" y2="84" stroke="#005ca9" strokeWidth="1" />
      
      {/* 4 Vertical Bars */}
      {/* Bar 1: Lightest cyan/blue */}
      <rect x="28" y="44" width="10" height="34" fill="#7ed2f3" />
      
      {/* Bar 2: Sky blue */}
      <rect x="42" y="28" width="10" height="50" fill="#36b5e6" />
      
      {/* Bar 3: Blue */}
      <rect x="56" y="14" width="10" height="64" fill="#008ecb" />
      
      {/* Bar 4: Dark blue */}
      <rect x="70" y="8" width="10" height="70" fill="#005ca9" />
      
      {/* Swooping curved arrow */}
      <path
        d="M 12,76 C 35,76 65,70 100,24"
        stroke="#2db3e5"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrowhead pointing top-right */}
      <path
        d="M 88,24 L 106,14 L 101,34 Z"
        fill="#2db3e5"
        stroke="#2db3e5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Text "ensae" at the bottom */}
      <text
        x="60"
        y="105"
        textAnchor="middle"
        fontFamily="'Inter', 'Space Grotesk', 'Helvetica Neue', 'Segoe UI', sans-serif"
        fontWeight="600"
        fontSize="21"
        fill="#005ca9"
        letterSpacing="-0.5"
      >
        ensae
      </text>
    </svg>
  );
}
