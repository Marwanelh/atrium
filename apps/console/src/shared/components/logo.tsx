interface LogoProps {
  size?: number;
  className?: string;
  /** Fill of the app-icon plate. The mark is knocked out of it in white. */
  color?: string;
  /** No longer used: the Atrium mark is a static geometric form, not an
   *  animated equaliser. Kept so existing call sites keep compiling. */
  animate?: boolean;
  speed?: number; // seconds
}

/**
 * The Atrium app icon: the arch mark knocked out of a filled plate.
 *
 * The plate keeps the visual role the previous logo had in the auth header and
 * the sidebar — a solid app icon rather than a bare glyph — while the mark
 * itself is the single path from assets/brand/atrium-mark.svg, scaled into the
 * 200-unit canvas. Geometry only, no strokes, so it stays crisp at every size.
 */
const Logo = ({ size = 40, className, color = "#0053fd" }: LogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ display: "block" }}
      role="img"
      aria-label="Atrium"
    >
      <rect x="5" y="5" width="190" height="190" rx="30" fill={color} />
      <path
        d="M2.5 21.5V12A9.5 9.5 0 0 1 21.5 12V21.5H16V10A4 4 0 0 0 8 10V21.5Z"
        fill="white"
        transform="translate(28 28) scale(6)"
      />
    </svg>
  );
};

export default Logo;
