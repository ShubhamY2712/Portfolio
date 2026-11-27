/** The hand-drawn "SY" pen-stroke monogram (approved in the Phase 0 style frame). */
export default function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path strokeWidth="2.4" d="M18.6 11.4c-1.5-1.9-5.4-2.6-7.6-.9-2.3 1.8-1.4 4.6 1.2 5.8l3.3 1.6c2.9 1.4 3.6 4.5 1.2 6.4-2.2 1.7-6 1.2-8-1" />
      <path strokeWidth="2.4" d="M21.4 10.6l5.2 8" />
      <path strokeWidth="2.2" d="M33.2 10.2l-6.6 8.4" />
      <path strokeWidth="2.2" d="M26.6 18.6l-.9 11.6" />
    </svg>
  );
}
