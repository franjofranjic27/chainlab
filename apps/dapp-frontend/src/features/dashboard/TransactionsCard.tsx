import { Icon } from "../../icons";
import { TXNS } from "./data";

/** Recent on-chain activity feed. */
export function TransactionsCard() {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Recent activity</h3>
        <div className="right">
          <button className="btn" style={{ padding: "5px 10px", fontSize: 12 }}>
            View all <Icon.ArrowUpRight size={12} />
          </button>
        </div>
      </div>
      <div>
        {TXNS.map((t, i) => (
          <div className="tx-row" key={i}>
            <span className={`tx-icon ${t.kind}`}>
              {t.kind === "in" && <Icon.ArrowDownLeft />}
              {t.kind === "out" && <Icon.ArrowUpRight />}
              {t.kind === "swap" && <Icon.Swap />}
            </span>
            <div className="t-meta">
              <b>{t.title}</b>
              <span>
                {t.from} · {t.time}
              </span>
            </div>
            <div className="t-amount">
              <b style={{ color: t.kind === "out" ? "var(--negative)" : "var(--positive)" }}>
                {t.amount}
              </b>
              <span>{t.value}</span>
            </div>
            <span className={`t-status ${t.status === "ok" ? "ok" : "pend"}`}>
              {t.status === "ok" ? "Confirmed" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
