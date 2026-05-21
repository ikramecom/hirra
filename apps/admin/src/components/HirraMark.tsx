export function HirraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M7 24V8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M21 24V8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M7 16h7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path
        d="M17.5 8.5c5.2 1.4 8.8 5.4 9.2 11.8"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
