// Draws "block letter" ASCII art as an SVG instead of text: every █ becomes a solid pixel, plus a
// darker copy offset behind it as the drop shadow (the art's ╔═╗ shadow characters are ignored).
// Text rendering of this art depends on the font having seamless block and box-drawing glyphs,
// which most web and system monospace fonts don't, so it breaks into gaps and doubled lines.
// Each cell is 1 × 2 units, like a terminal character cell.
export const PixelLogo = ({ art, label, className = '' }) => {
  const rows = art.split('\n').filter((line) => line.includes('█'));
  const pad = Math.min(...rows.map((line) => line.match(/^ */)[0].length));
  const cells = rows.flatMap((line, y) =>
    [...line.slice(pad)].flatMap((ch, x) => (ch === '█' ? [{ x, y: y * 2 }] : [])),
  );
  const width = Math.max(...cells.map((c) => c.x)) + 2;
  const height = rows.length * 2 + 1;
  // Slight overlap (1.04) so neighbouring pixels never show hairline seams when scaled.
  const blocks = (dx, dy) =>
    cells.map(({ x, y }) => <rect key={`${x}-${y}`} x={x + dx} y={y + dy} width={1.04} height={2.04} />);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={className}
    >
      <g className="fill-green-700">{blocks(0.55, 0.8)}</g>
      <g className="fill-green-400">{blocks(0, 0)}</g>
    </svg>
  );
};
