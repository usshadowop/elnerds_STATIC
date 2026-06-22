export function ExtraLifeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 433 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* halo */}
      <ellipse cx="190" cy="55" rx="58" ry="20" />

      {/* right wing */}
      <path d="M255 90 C300 70 340 40 365 12" />
      <path d="M250 110 C300 100 345 80 385 55" />
      <path d="M248 132 C295 130 340 120 375 105" />

      {/* left wing */}
      <path d="M150 130 C100 120 55 105 18 95" />
      <path d="M152 110 C105 95 60 75 25 60" />
      <path d="M158 92 C115 75 75 55 45 35" />

      {/* controller body */}
      <path d="M160 95 C120 95 90 130 85 175 C80 215 100 250 130 255 C150 258 160 235 190 190 C200 175 230 175 240 190 C270 235 280 258 300 255 C330 250 350 215 345 175 C340 130 310 95 270 95 C235 95 195 95 160 95 Z" />

      {/* d-pad */}
      <path d="M150 165 v40 M130 185 h40" />

      {/* buttons */}
      <circle cx="270" cy="165" r="6" />
      <circle cx="290" cy="185" r="6" />
      <circle cx="250" cy="185" r="6" />
      <circle cx="270" cy="205" r="6" />
    </svg>
  );
}
