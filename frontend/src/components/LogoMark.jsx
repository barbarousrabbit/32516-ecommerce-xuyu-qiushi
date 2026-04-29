// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)

/**
 * ShopCart brand mark — custom S letterform on an orange rounded square.
 * Not based on any icon library; the S path is hand-crafted.
 * size prop controls the rendered pixel dimensions (default 32).
 */
export default function LogoMark({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Brand colour background — rounded square ("squircle") */}
      <rect width="32" height="32" rx="8" fill="#e8590c" />

      {/*
        Custom S letterform.
        Path traces: upper-right terminal → top arc → left side of upper C →
        centre crossing → right side of lower C → bottom arc → lower-left terminal.
        stroke-linecap="round" gives soft, confident terminals without serif clutter.
      */}
      <path
        d="M 24,8
           C 24,5.5 22,5 16,5
           C 10,5 8,6.5 8,10
           C 8,13.5 10,15 16,16.5
           C 22,18 24,19.5 24,23
           C 24,26.5 22,27 16,27
           C 10,27 8,26.5 8,24"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
