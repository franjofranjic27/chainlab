/**
 * Chart maths — deterministic series generation + smoothed SVG paths.
 * Ported from the design handoff (reference/chart.jsx). The series generator
 * is a stand-in: replace with live on-chain / API price data later.
 */

/** Deterministic pseudo-random generator — stable chart data per seed. */
function seedRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Generate a deterministic price-like series of `count` samples. */
export function makeSeries(
  count: number,
  seed: number,
  start = 1.0,
  vol = 0.04,
  drift = 0.0015,
): number[] {
  const rng = seedRand(seed);
  const pts: number[] = [];
  let v = start;
  for (let i = 0; i < count; i++) {
    v = Math.max(0.0001, v * (1 + (rng() - 0.5) * vol + drift));
    pts.push(v);
  }
  return pts;
}

export interface SmoothPath {
  d: string;
  x: (i: number) => number;
  y: (v: number) => number;
}

/** Build a smoothed (quadratic) SVG path for a sparkline-sized series. */
export function smoothPath(points: number[], w: number, h: number, pad = 4): SmoothPath {
  if (!points.length) return { d: "", x: () => 0, y: () => 0 };
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const dx = (w - pad * 2) / (points.length - 1);
  const y = (v: number) => pad + (h - pad * 2) * (1 - (v - min) / range);
  const x = (i: number) => pad + i * dx;
  let d = `M ${x(0)} ${y(points[0])}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = x(i - 1) + dx / 2;
    d += ` Q ${cpx} ${y(points[i - 1])}, ${(x(i - 1) + x(i)) / 2} ${(y(points[i - 1]) + y(points[i])) / 2}`;
    d += ` T ${x(i)} ${y(points[i])}`;
  }
  return { d, x, y };
}
