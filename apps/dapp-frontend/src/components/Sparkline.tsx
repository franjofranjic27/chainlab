import { useMemo } from "react";
import { smoothPath } from "../lib/chart";

interface SparklineProps {
  points: number[];
  color?: string;
  width?: number;
  height?: number;
}

/** Tiny inline trend chart — no fill, smoothed stroke. */
export function Sparkline({
  points,
  color = "var(--accent)",
  width = 56,
  height = 22,
}: SparklineProps) {
  const d = useMemo(() => smoothPath(points, width, height, 2).d, [points, width, height]);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="h-spark"
      style={{ overflow: "visible" }}
    >
      <path d={d} stroke={color} fill="none" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
