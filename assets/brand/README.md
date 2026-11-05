# Atrium brand assets

## The mark

An **arch with a doorway cut through it**.

An atrium is the entrance space a building opens into — which is what this product is for the
customers who arrive through it. The glyph is built from two concentric arches so it reads as a
space you look *into*, rather than a symbol placed on top of one. It deliberately avoids the
four-pointed "AI sparkle" that every other product in this category uses.

It is pure geometry, no strokes, filled with `currentColor`. Three consequences worth knowing:

- **It holds its shape at any size.** No stroke widths to thin out, so the 16px favicon and the
  README banner are the same drawing rather than two exports.
- **It inherits colour.** Drop it next to text and it takes that colour. Light and dark themes need
  no separate files.
- **It is one path.** Diffable, hand-editable, a few hundred bytes.

## Files

| File | Use |
|---|---|
| `atrium-mark.svg` | The symbol on its own — favicon, avatar, app icon, social preview |
| `atrium-logo.svg` | Horizontal lockup: mark plus wordmark, for headers and READMEs |
| `apps/console/public/favicon.svg` | The browser tab icon |
| `apps/launcher/src/shared/assets.ts` | The inline copies the widget renders |

## Usage rules

- Leave clear space of at least half the mark's width on every side.
- Minimum size: **16px**. Below that, use the mark without the wordmark.
- Do not add effects, gradients, outlines or rotation.
- Do not stretch it — it is square by design.
- On a coloured surface, use a white fill rather than adding a background plate.

## Wordmark

The lockup's text uses a system-font stack so the file stays editable and reviewable in a diff.
**Outline it to paths before print**, or anywhere a font substitution would be visible.

## Swapping the mark

Both inline copies live in `apps/launcher/src/shared/assets.ts` as template strings. Replace the
`d` attribute of the single `<path>` and everything downstream follows — there is no build step,
no sprite sheet and no rasterised variant to regenerate.
