import { useState } from "react";
import { Icon } from "../../icons";

type SwapTok = "ETH" | "CLAB";

const RATE = 11842.5; // 1 ETH = 11,842.5 CLAB (hardcoded, per handoff)

/** Quick swap card — local conversion only; wire to a router later. */
export function SwapCard() {
  const [fromAmt, setFromAmt] = useState("1.0");
  const [fromTok, setFromTok] = useState<SwapTok>("ETH");
  const [toTok, setToTok] = useState<SwapTok>("CLAB");

  const flip = () => {
    setFromTok(toTok);
    setToTok(fromTok);
  };

  const fromAmtN = parseFloat(fromAmt) || 0;
  const toAmt = fromTok === "ETH" ? fromAmtN * RATE : fromAmtN / RATE;

  return (
    <div className="card">
      <div className="card-head">
        <h3>Quick swap</h3>
        <div className="right">
          <button className="icon-btn" title="Refresh rate" style={{ width: 28, height: 28 }}>
            <Icon.Refresh size={13} />
          </button>
          <button className="icon-btn" title="Settings" style={{ width: 28, height: 28 }}>
            <Icon.Settings size={13} />
          </button>
        </div>
      </div>
      <div className="swap-card">
        <div className="swap-row">
          <div className="swap-row-head">
            <span>You pay</span>
            <span>
              Balance:{" "}
              <b className="mono" style={{ color: "var(--text)" }}>
                2.847
              </b>
            </span>
          </div>
          <div className="swap-row-main">
            <input
              className="swap-amount"
              value={fromAmt}
              onChange={(e) => setFromAmt(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0.0"
              inputMode="decimal"
            />
            <button className="token-select">
              <span className={`token-icon ti-${fromTok.toLowerCase()}`}>{fromTok.slice(0, 1)}</span>
              {fromTok}
              <Icon.ChevDown size={12} />
            </button>
          </div>
          <div className="swap-row-head" style={{ marginTop: 0 }}>
            <span>${(fromTok === "ETH" ? fromAmtN * 3290 : fromAmtN * 0.278).toFixed(2)}</span>
            <span style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>Max</span>
          </div>
        </div>

        <button className="swap-flip" onClick={flip} title="Flip">
          <Icon.ArrowDown />
        </button>

        <div className="swap-row">
          <div className="swap-row-head">
            <span>You receive</span>
            <span>
              Balance:{" "}
              <b className="mono" style={{ color: "var(--text)" }}>
                12,480.50
              </b>
            </span>
          </div>
          <div className="swap-row-main">
            <input
              className="swap-amount"
              value={toAmt.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              readOnly
            />
            <button className="token-select">
              <span className={`token-icon ti-${toTok.toLowerCase()}`}>{toTok.slice(0, 1)}</span>
              {toTok}
              <Icon.ChevDown size={12} />
            </button>
          </div>
          <div className="swap-row-head" style={{ marginTop: 0 }}>
            <span>${(toTok === "CLAB" ? toAmt * 0.278 : toAmt * 3290).toFixed(2)}</span>
          </div>
        </div>

        <div className="swap-info">
          <div className="swap-info-row">
            <span>Rate</span>
            <b>
              1 {fromTok} = {fromTok === "ETH" ? "11,842.5" : "0.0000844"} {toTok}
            </b>
          </div>
          <div className="swap-info-row">
            <span>Network fee</span>
            <b>~ $2.14</b>
          </div>
          <div className="swap-info-row">
            <span>Slippage</span>
            <b>0.50%</b>
          </div>
          <div className="swap-info-row">
            <span>Min. received</span>
            <b className="mono">
              {(toAmt * 0.995).toLocaleString(undefined, { maximumFractionDigits: 2 })} {toTok}
            </b>
          </div>
        </div>

        <button className="swap-cta">
          Swap {fromTok} for {toTok}
        </button>
      </div>
    </div>
  );
}
