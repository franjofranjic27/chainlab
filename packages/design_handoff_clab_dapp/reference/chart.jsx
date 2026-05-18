/* global React */
const { useMemo, useState, useRef, useEffect } = React;

// Deterministic pseudo-random for stable chart data per seed
function seedRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeSeries(count, seed, start = 1.0, vol = 0.04, drift = 0.0015) {
  const rng = seedRand(seed);
  const pts = [];
  let v = start;
  for (let i = 0; i < count; i++) {
    v = Math.max(0.0001, v * (1 + (rng() - 0.5) * vol + drift));
    pts.push(v);
  }
  return pts;
}

function smoothPath(points, w, h, pad = 4) {
  if (!points.length) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const dx = (w - pad * 2) / (points.length - 1);
  const y = (v) => pad + (h - pad * 2) * (1 - (v - min) / range);
  const x = (i) => pad + i * dx;
  let d = `M ${x(0)} ${y(points[0])}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = x(i - 1) + dx / 2;
    d += ` Q ${cpx} ${y(points[i - 1])}, ${(x(i - 1) + x(i)) / 2} ${(y(points[i - 1]) + y(points[i])) / 2}`;
    d += ` T ${x(i)} ${y(points[i])}`;
  }
  return { d, x, y };
}

// Sparkline — tiny inline chart
function Sparkline({ points, color = "var(--accent)", width = 56, height = 22 }) {
  const path = useMemo(() => smoothPath(points, width, height, 2), [points, width, height]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="h-spark" style={{ overflow: "visible" }}>
      <path d={path.d} stroke={color} fill="none" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Big price chart with hover crosshair + tooltip
function PriceChart({ data, color = "var(--accent)", height = 280 }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(800);
  const [hover, setHover] = useState(null);

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
    if (!data.length) return { dPath: "", fillPath: "" };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const dx = innerW / (data.length - 1);
    const xAt = (i) => padLeft + i * dx;
    const yAt = (v) => pad + innerH * (1 - (v - min) / range);
    let d = `M ${xAt(0)} ${yAt(data[0])}`;
    for (let i = 1; i < data.length; i++) {
      const x0 = xAt(i - 1), x1 = xAt(i);
      const y0 = yAt(data[i - 1]), y1 = yAt(data[i]);
      const mx = (x0 + x1) / 2;
      d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
    }
    const fill = `${d} L ${xAt(data.length - 1)} ${pad + innerH} L ${xAt(0)} ${pad + innerH} Z`;
    return { dPath: d, fillPath: fill, xAt, yAt, min, max };
  }, [data, innerW, innerH, padLeft, pad]);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < padLeft || x > padLeft + innerW) { setHover(null); return; }
    const dx = innerW / (data.length - 1);
    const i = Math.max(0, Math.min(data.length - 1, Math.round((x - padLeft) / dx)));
    setHover({ i, x: xAt(i), y: yAt(data[i]), v: data[i] });
  };

  // Y-axis grid lines (4 ticks)
  const ticks = useMemo(() => {
    if (min == null) return [];
    const out = [];
    for (let k = 0; k <= 4; k++) {
      const v = min + ((max - min) * k) / 4;
      out.push({ v, y: pad + innerH * (1 - k / 4) });
    }
    return out;
  }, [min, max, innerH, pad]);

  // X-axis labels (5)
  const xLabels = useMemo(() => {
    if (!data.length) return [];
    const labels = ["00:00", "06:00", "12:00", "18:00", "Now"];
    return labels.map((l, k) => ({ l, x: padLeft + (innerW * k) / 4 }));
  }, [data.length, innerW, padLeft]);

  const fmt = (v) => v.toFixed(4);

  return (
    <div ref={wrapRef} className="chart-svg-wrap" style={{ position: "relative" }}>
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
          <line key={k} x1={padLeft} x2={w - pad} y1={t.y} y2={t.y} stroke="var(--chart-grid)" strokeWidth="1" />
        ))}
        {/* Y-axis labels */}
        {ticks.map((t, k) => (
          <text key={k} x={padLeft - 8} y={t.y + 3} fontSize="10" fill="var(--muted)" textAnchor="end" fontFamily="var(--font-mono)">
            ${fmt(t.v)}
          </text>
        ))}
        {/* X-axis labels */}
        {xLabels.map((t, k) => (
          <text key={k} x={t.x} y={height - 6} fontSize="10" fill="var(--muted)" textAnchor="middle" fontFamily="var(--font-mono)">
            {t.l}
          </text>
        ))}

        <path d={fillPath} fill="url(#chartFill)" />
        <path d={dPath} stroke={color} strokeWidth="1.75" fill="none" strokeLinejoin="round" />

        {hover && (
          <g>
            <line x1={hover.x} x2={hover.x} y1={pad} y2={pad + innerH} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={hover.x} cy={hover.y} r="4" fill="var(--surface)" stroke={color} strokeWidth="2" />
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
          <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>${hover.v.toFixed(4)}</div>
        </div>
      )}
    </div>
  );
}

window.makeSeries = makeSeries;
window.Sparkline = Sparkline;
window.PriceChart = PriceChart;
