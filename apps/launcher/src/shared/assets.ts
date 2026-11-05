/**
 * The Atrium mark, inlined so the widget has no asset request to make.
 *
 * An arch with a doorway cut through it: an atrium is the entrance space a
 * building opens into, which is what this product is for the customers who
 * arrive through it. Geometry only, no strokes, so it holds its shape from a
 * 16px favicon upwards. See assets/brand/.
 *
 * Filled with `currentColor`, so it takes the colour of whatever it sits in.
 */
export const ATRIUM_LOGO_SVG = `
<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Atrium">
  <path d="M2.5 21.5V12A9.5 9.5 0 0 1 21.5 12V21.5H16V10A4 4 0 0 0 8 10V21.5Z"></path>
</svg>`;

/**
 * The same mark for the floating launcher bubble, which sits on a coloured
 * surface, so this one is filled white rather than inheriting the text colour.
 */
export const ATRIUM_FLOATING_LOGO_SVG = `
<svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Atrium">
  <path d="M2.5 21.5V12A9.5 9.5 0 0 1 21.5 12V21.5H16V10A4 4 0 0 0 8 10V21.5Z" fill="white"></path>
</svg>
`;
