import { Icon } from "../../icons";
import { POOLS } from "./data";

/** Liquidity-pool positions. */
export function PoolsCard() {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Liquidity pools</h3>
        <div className="right">
          <button className="btn" style={{ padding: "5px 10px", fontSize: 12 }}>
            <Icon.Plus size={12} /> Add
          </button>
        </div>
      </div>
      <div>
        {POOLS.map((p, i) => (
          <div className="pool-row" key={i}>
            <div className="pool-pair">
              <div className="pair-icons">
                <span className={`token-icon ti-${p.a.toLowerCase()}`}>{p.a.slice(0, 1)}</span>
                <span className={`token-icon ti-${p.b.toLowerCase()}`}>{p.b.slice(0, 1)}</span>
              </div>
              <b>
                {p.a} / {p.b}
              </b>
              <span className="pool-fee">{p.fee}</span>
            </div>
            <div className="pool-stats">
              <div className="pool-stat">
                APR
                <b style={{ color: "var(--positive)" }}>{p.apr}</b>
              </div>
              <div className="pool-stat">
                TVL
                <b>{p.tvl}</b>
              </div>
              <div className="pool-stat">
                My position
                <b>{p.mine}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
