/* global React, ReactDOM, Sidebar, Topbar, HeroStrip, ClabPriceCard, SwapCard,
   HoldingsCard, TransactionsCard, PoolsCard, PlaceholderPage,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakColor, TweakToggle */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "sidebarWidth": 240,
  "accent": "#7c5cff",
  "cardRadius": 8
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");

  // Apply theme + tweakable CSS vars on root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t.theme);
    root.style.setProperty("--sidebar-w", `${t.sidebarWidth}px`);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--r-card", `${t.cardRadius}px`);
    // soft accent variants derived from selected accent
    root.style.setProperty("--accent-soft", `${t.accent}1f`);
    root.style.setProperty("--accent-soft-strong", `${t.accent}38`);
    // Hover accent — slightly lighter
    root.style.setProperty("--accent-hover", t.accent);
  }, [t]);

  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");

  return (
    <div className="app" data-collapsed={collapsed} data-screen-label="01 Dashboard">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        active={active}
        setActive={setActive}
      />
      <div className="main-col">
        <Topbar theme={t.theme} onToggleTheme={toggleTheme} active={active} />
        <main className="content">
          {active === "dashboard" ? (
            <>
              <div className="page-head">
                <div>
                  <h1>Good evening, vitalik.lab</h1>
                  <p>Here's what's happening with your portfolio today.</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn">
                    <Icon.External size={13} /> View on Etherscan
                  </button>
                  <button className="btn btn-primary">
                    <Icon.Plus size={13} /> New transfer
                  </button>
                </div>
              </div>

              <HeroStrip />

              <div className="grid">
                <ClabPriceCard />
                <SwapCard />
              </div>

              <div className="grid-3">
                <HoldingsCard />
                <TransactionsCard />
                <PoolsCard />
              </div>
            </>
          ) : (
            <>
              <div className="page-head">
                <div>
                  <h1 style={{ textTransform: "capitalize" }}>{active}</h1>
                  <p>This view is still being designed.</p>
                </div>
              </div>
              <PlaceholderPage name={active.charAt(0).toUpperCase() + active.slice(1)} />
            </>
          )}
        </main>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakRadio label="Theme" value={t.theme} onChange={(v) => setTweak("theme", v)}
            options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]} />
          <TweakColor label="Accent color" value={t.accent} onChange={(v) => setTweak("accent", v)}
            options={["#7c5cff", "#00d09c", "#ff7a45", "#3b82f6"]} />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakSlider label="Sidebar width" value={t.sidebarWidth} min={200} max={300} step={4}
            onChange={(v) => setTweak("sidebarWidth", v)} unit="px" />
          <TweakSlider label="Card corner radius" value={t.cardRadius} min={2} max={20} step={1}
            onChange={(v) => setTweak("cardRadius", v)} unit="px" />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
