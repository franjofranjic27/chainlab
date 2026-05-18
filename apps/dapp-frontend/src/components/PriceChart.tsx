import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";

interface PriceChartProps {
  data: number[];
  color?: string;
  height?: number;
}

interface HoverState {
  i: number;
  x: number;
  y: number;
  v: number;
}

/** Large CLAB/USD price chart with area fill, gridlines and a hover crosshair. */
export function PriceChart({ data, color = "var(--accent)", height = 280 }: PriceChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(800);
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.max(280, e.contentRect.width));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const pad = 8;
  const padBottom = 22; // room for x labels
  const padLeft = 36; // room for y labels
  const innerW = w - padLeft - pad;
  const innerH = height - pad - padBottom;

  const { dPath, fillPath, xAt, yAt, min, max } = useMemo(() => {
    const lo = Math.min(...data);
    const hi = Math.max(...data);
    const range = hi - lo || 1;
    const dx = innerW / (data.length - 1);
    const xFn = (i: number) => padLeft + i * dx;
    const yFn = (v: number) => pad + innerH * (1 - (v - lo) / range);
    let d = `M ${xFn(0)} ${yFn(data[0])}`;
    for (let i = 1; i < data.length; i++) {
      const x0 = xFn(i - 1);
      const x1 = xFn(i);
      const y0 = yFn(data[i - 1]);
      const y1 = yFn(data[i]);
      const mx = (x0 + x1) / 2;
      d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
    }
    const fill = `${d} L ${xFn(data.length - 1)} ${pad + innerH} L ${xFn(0)} ${pad + innerH} Z`;
    return { dPath: d, fillPath: fill, xAt: xFn, yAt: yFn, min: lo, max: hi };
  }, [data, innerW, innerH]);

  // Y-axis grid lines (5 ticks)
  const ticks = useMemo(() => {
    const out: { v: number; y: number }[] = [];
    for (let k = 0; k <= 4; k++) {
      const v = min + ((max - min) * k) / 4;
      out.push({ v, y: pad + innerH * (1 - k / 4) });
    }
    return out;
  }, [min, max, innerH]);

  // X-axis labels (5)
  const xLabels = useMemo(() => {
    const labels = ["00:00", "06:00", "12:00", "18:00", "Now"];
    return labels.map((l, k) => ({ l, x: padLeft + (innerW * k) / 4 }));
  }, [innerW]);

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < padLeft || x > padLeft + innerW) {
      setHover(null);
      return;
    }
    const dx = innerW / (data.length - 1);
    const i = Math.max(0, Math.min(data.length - 1, Math.round((x - padLeft) / dx)));
    setHover({ i, x: xAt(i), y: yAt(data[i]), v: data[i] });
  };

  const fmt = (v: number) => v.toFixed(4);

  return (
    <div ref={wrapRef} className="chart-svg-wrap">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        width={w}
        height={height}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        style={{ cursor: "crosshair" }}
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {ticks.map((t, k) => (
          <line
            key={k}
            x1={padLeft}
            x2={w - pad}
            y1={t.y}
            y2={t.y}
            stroke="var(--chart-grid)"
            strokeWidth="1"
          />
        ))}
        {/* Y-axis labels */}
        {ticks.map((t, k) => (
          <text
            key={k}
            x={padLeft - 8}
            y={t.y + 3}
            fontSize="10"
            fill="var(--muted)"
            textAnchor="end"
            fontFamily="var(--font-mono)"
          >
            ${fmt(t.v)}
          </text>
        ))}
        {/* X-axis labels */}
        {xLabels.map((t, k) => (
          <text
            key={k}
            x={t.x}
            y={height - 6}
            fontSize="10"
            fill="var(--muted)"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
          >
            {t.l}
          </text>
        ))}

        <path d={fillPath} fill="url(#chartFill)" />
        <path d={dPath} stroke={color} strokeWidth="1.75" fill="none" strokeLinejoin="round" />

        {hover && (
          <g>
            <line
              x1={hover.x}
              x2={hover.x}
              y1={pad}
              y2={pad + innerH}
              stroke="var(--border-strong)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={hover.x}
              cy={hover.y}
              r="4"
              fill="var(--surface)"
              stroke={color}
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {hover && (
        <div
          style={{
            position: "absolute",
            left: Math.min(w - 140, Math.max(8, hover.x + 10)),
            top: Math.max(8, hover.y - 50),
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 11.5,
            pointerEvents: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ color: "var(--muted)", fontSize: 10.5 }}>CLAB / USD</div>
          <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>
            ${hover.v.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}
