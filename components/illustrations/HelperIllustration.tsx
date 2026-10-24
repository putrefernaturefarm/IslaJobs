interface HelperIllustrationProps {
  className?: string
}

/**
 * Flat-illustration "helper" character — cropped at the hips so it sits flush
 * against a banner's bottom edge. Built from brand tokens only (primary blue +
 * amber vest + warm skin tone) with light two-tone shading for depth.
 */
export function HelperIllustration({ className }: HelperIllustrationProps) {
  return (
    <svg
      viewBox="0 0 220 240"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="110" cy="235" rx="72" ry="7" fill="#000000" opacity="0.1" />

      <path d="M56,165 Q40,180 44,215" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="216" r="11" fill="#F2B98A" />

      <path d="M50,240 L50,165 Q50,124 110,120 Q170,124 170,165 L170,240 Z" fill="#FFFFFF" />
      <path d="M140,166 Q170,126 170,165 L170,240 L150,240 Q146,195 140,166 Z" fill="#ECEAE6" />

      <path d="M66,240 L66,170 Q66,138 110,135 Q154,138 154,170 L154,240 Z" fill="#D97706" />
      <path d="M70,170 Q70,142 100,137 L100,240 L72,240 Z" fill="#EA9A3D" opacity="0.55" />
      <line x1="110" y1="135" x2="110" y2="240" stroke="#8A4A0A" strokeWidth="1.5" opacity="0.4" />
      <rect x="118" y="176" width="20" height="15" rx="3" fill="none" stroke="#8A4A0A" strokeWidth="1.5" opacity="0.5" />

      <path d="M95,137 L84,120 L101,129 Z" fill="#FFFFFF" stroke="#E4E0D8" strokeWidth="1" />
      <path d="M125,137 L136,120 L119,129 Z" fill="#FFFFFF" stroke="#E4E0D8" strokeWidth="1" />

      <rect x="99" y="106" width="22" height="28" fill="#F2B98A" />
      <path d="M99,126 Q110,134 121,126 L121,134 Q110,140 99,134 Z" fill="#E0A376" opacity="0.6" />

      <path d="M164,163 Q186,129 167,95" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" fill="none" />
      <circle cx="166" cy="91" r="12" fill="#F2B98A" />
      <g transform="translate(150,42) rotate(-22)">
        <rect x="-4" y="6" width="8" height="42" rx="4" fill="#1565D8" />
        <circle cx="0" cy="2" r="12" fill="none" stroke="#1565D8" strokeWidth="6" />
        <circle cx="0" cy="2" r="4.5" fill="#0F3460" />
      </g>

      <circle cx="110" cy="85" r="36" fill="#F2B98A" />
      <circle cx="74" cy="88" r="7" fill="#F2B98A" />
      <circle cx="146" cy="88" r="7" fill="#F2B98A" />
      <circle cx="128" cy="92" r="11" fill="#E0A376" opacity="0.35" />

      <path d="M74,68 Q74,38 110,38 Q146,38 146,68 L146,64 Q146,50 110,50 Q74,50 74,64 Z" fill="#1565D8" />
      <line x1="110" y1="38" x2="110" y2="64" stroke="#0E4DAE" strokeWidth="1.5" opacity="0.5" />
      <path d="M72,63 Q110,78 148,63 Q148,56 110,56 Q72,56 72,63 Z" fill="#0E4DAE" />
      <circle cx="110" cy="39" r="3" fill="#0E4DAE" />

      <ellipse cx="98" cy="87" rx="3.4" ry="4.2" fill="#1A1A1A" />
      <ellipse cx="122" cy="87" rx="3.4" ry="4.2" fill="#1A1A1A" />
      <path d="M91,78 Q98,74 105,78" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M115,78 Q122,74 129,78" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M96,99 Q110,108 124,99" stroke="#1A1A1A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="85" cy="95" r="6" fill="#F2A878" opacity="0.45" />
      <circle cx="135" cy="95" r="6" fill="#F2A878" opacity="0.45" />
    </svg>
  )
}
