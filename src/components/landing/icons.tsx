import type { ReactElement, ReactNode } from 'react';

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const icons: Record<string, ReactElement> = {
  card: (
    <Svg>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </Svg>
  ),
  key: (
    <Svg>
      <circle cx="8" cy="15" r="5" />
      <path d="M11.6 11.4 21 2" />
      <path d="M16 7l4 4" />
    </Svg>
  ),
  shieldCheck: (
    <Svg>
      <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4.5" />
    </Svg>
  ),
  sliders: (
    <Svg>
      <path d="M4 21v-6" />
      <path d="M4 11V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-4" />
      <path d="M20 13V3" />
      <path d="M2 15h4" />
      <path d="M10 8h4" />
      <path d="M18 17h4" />
    </Svg>
  ),
  eye: (
    <Svg>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  ),
  play: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5z" />
    </Svg>
  ),
  clock: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  ),
  checkCircle: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </Svg>
  ),
  returnArrow: (
    <Svg>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
    </Svg>
  ),
  layers: (
    <Svg>
      <path d="M12 3 3 8l9 5 9-5-9-5z" />
      <path d="m3 13 9 5 9-5" />
    </Svg>
  ),
  reconcile: (
    <Svg>
      <path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
      <path d="M8.5 13l2.5 2.5 4.5-5" />
    </Svg>
  ),
};
