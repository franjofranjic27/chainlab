import { Icon } from "../../icons";
import { Sparkline } from "../../components/Sparkline";
import { makeSeries } from "../../lib/chart";
import { HOLDINGS } from "./data";

/** Multi-asset holdings list with per-row sparklines. */
export function HoldingsCard() {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Your holdings</h3>
        <span className="sub">5 assets</span>
        <div className="right">
          <button className="btn" style={{ padding: "5px 10px", fontSize: 12 }}>
            <Icon.Filter size={12} /> Filter
          </button>
        </div>
      </div>
      <div>
        {HOLDINGS.map((h) => {
          const series = makeSeries(28, h.spark.seed, 1, h.spark.vol, h.spark.drift);
          const isPos = !h.change.startsWith("-");
          return (
            <div className="holding-row" key={h.sym}>
              <span className={`token-icon ti-${h.sym.toLowerCase()}`}>{h.sym.slice(0, 1)}</span>
              <div className="h-name">
                <b>{h.sym}</b>
                <span>{h.name}</span>
              </div>
              <Sparkline
                points={series}
                color={h.spark.color ?? (isPos ? "var(--positive)" : "var(--negative)")}
              />
              <div className="h-amount">
                ${h.value}
                <small>
                  {h.amount} {h.sym}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
