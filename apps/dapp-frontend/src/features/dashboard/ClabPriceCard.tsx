import { useMemo, useState } from "react";
import { Icon } from "../../icons";
import { PriceChart } from "../../components/PriceChart";
import { makeSeries } from "../../lib/chart";

type Timeframe = "1H" | "24H" | "7D" | "30D" | "1Y" | "ALL";

const TFS: Timeframe[] = ["1H", "24H", "7D", "30D", "1Y", "ALL"];
const TF_SEEDS: Record<Timeframe, number> = { "1H": 11, "24H": 47, "7D": 22, "30D": 91, "1Y": 5, ALL: 33 };
const TF_VOL: Record<Timeframe, number> = { "1H": 0.012, "24H": 0.022, "7D": 0.04, "30D": 0.06, "1Y": 0.09, ALL: 0.12 };
const TF_DRIFT: Record<Timeframe, number> = { "1H": 0.0002, "24H": 0.0008, "7D": 0.0012, "30D": 0.0014, "1Y": 0.001, ALL: 0.0006 };
const TF_COUNT: Record<Timeframe, number> = { "1H": 60, "24H": 96, "7D": 84, "30D": 90, "1Y": 120, ALL: 160 };

/** CLAB / USD price chart card with timeframe tabs + summary stats. */
export function ClabPriceCard() {
  const [tf, setTf] = useState<Timeframe>("7D");
  const data = useMemo(
    () => makeSeries(TF_COUNT[tf], TF_SEEDS[tf], 0.28, TF_VOL[tf], TF_DRIFT[tf]),
    [tf],
  );
  const first = data[0];
  const last = data[data.length - 1];
  const change = ((last - first) / first) * 100;
  const isPos = change >= 0;

  return (
    <div className="card chart-card">
      <div className="card-head">
        <div className="token-icon ti-clab" style={{ width: 26, height: 26, fontSize: 11 }}>
          CL
        </div>
        <h3>CLAB / USD</h3>
        <span className="sub">ChainLab Token</span>
        <div className="right">
          <div className="chart-tabs">
            {TFS.map((k) => (
              <button
                key={k}
                className="chart-tab"
                data-active={tf === k}
                onClick={() => setTf(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-head-row">
        <div>
          <div className="chart-price">
            <span className="mono">${last.toFixed(4)}</span>
            <small>USD</small>
            <span className={`delta ${isPos ? "pos" : "neg"}`}>
              {isPos ? <Icon.ChevUp size={10} /> : <Icon.ChevDown size={10} />}
              {isPos ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
          <div className="chart-meta">Last updated 12 seconds ago · Uniswap v3 · 0x4f2a…cb91</div>
        </div>
      </div>

      <div className="chart-stat-row">
        <div className="chart-stat">
          <div className="lbl">Market cap</div>
          <div className="val">$12.4M</div>
        </div>
        <div className="chart-stat">
          <div className="lbl">24h volume</div>
          <div className="val">$842K</div>
        </div>
        <div className="chart-stat">
          <div className="lbl">Holders</div>
          <div className="val">3,184</div>
        </div>
        <div className="chart-stat">
          <div className="lbl">Circ. supply</div>
          <div className="val">44.2M CLAB</div>
        </div>
        <div className="chart-stat">
          <div className="lbl">FDV</div>
          <div className="val">$28.0M</div>
        </div>
      </div>

      <PriceChart data={data} color="var(--accent)" height={250} />
    </div>
  );
}
