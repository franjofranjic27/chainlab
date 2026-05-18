import { Icon } from "../../icons";

/** Portfolio summary strip — one card divided into 4 cells. */
export function HeroStrip() {
  return (
    <div className="card hero">
      <div className="hero-cell">
        <span className="lbl">Portfolio value</span>
        <span className="val">$48,392.17</span>
        <div className="meta">
          <span className="delta pos">
            <Icon.ChevUp size={10} />
            +2.41% · $1,138.22
          </span>
          <span>last 24h</span>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary">
            <Icon.Send size={13} /> Send
          </button>
          <button className="btn">
            <Icon.ArrowDownLeft size={13} /> Receive
          </button>
          <button className="btn">
            <Icon.Swap size={13} /> Swap
          </button>
        </div>
      </div>

      <div className="hero-cell">
        <span className="lbl">CLAB holdings</span>
        <span className="val sm">12,480.50</span>
        <div className="meta">
          <span className="mono">≈ $3,891.21</span>
          <span className="delta pos">
            <Icon.ChevUp size={10} />
            4.12%
          </span>
        </div>
      </div>

      <div className="hero-cell">
        <span className="lbl">Total earned</span>
        <span className="val sm">$1,284.06</span>
        <div className="meta">
          <span>from staking + LP</span>
        </div>
      </div>

      <div className="hero-cell">
        <span className="lbl">Active positions</span>
        <span className="val sm">7</span>
        <div className="meta">
          <span>3 LP · 2 staking · 2 lending</span>
        </div>
      </div>
    </div>
  );
}
