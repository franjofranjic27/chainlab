import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { DashboardView } from "./features/dashboard/DashboardView";
import type { PageId, Theme } from "./types";

/** Title shown on the placeholder header for non-dashboard pages. */
function pageTitle(id: PageId): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<PageId>("dashboard");

  // Apply theme as a `data-theme` attribute so the CSS variables re-bind.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="app" data-collapsed={collapsed}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        active={active}
        setActive={setActive}
      />
      <div className="main-col">
        <Topbar theme={theme} onToggleTheme={toggleTheme} active={active} />
        <main className="content">
          {active === "dashboard" ? (
            <DashboardView />
          ) : (
            <>
              <div className="page-head">
                <div>
                  <h1 style={{ textTransform: "capitalize" }}>{active}</h1>
                  <p>This view is still being designed.</p>
                </div>
              </div>
              <PlaceholderPage name={pageTitle(active)} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
