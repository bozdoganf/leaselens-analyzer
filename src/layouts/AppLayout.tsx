import { NavLink, useNavigate } from "react-router-dom";
import { Plus, LayoutDashboard, BarChart3, LineChart, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const primaryNav = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Analysis", to: "/results", icon: BarChart3 },
  { label: "Market Data", to: "/compare", icon: LineChart },
  { label: "Settings", to: "/settings", icon: Settings },
];

const secondaryNav = [
  { label: "Support", to: "/support", icon: HelpCircle },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="px-6 py-5 border-b border-border">
          <Logo subtitle="Student Portal" />
        </div>

        <div className="p-4">
          <Button
            onClick={() => navigate("/upload")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 shadow-soft"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {primaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-base",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6 space-y-1 border-t border-border pt-4">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-base",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-base"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-border bg-card px-4 h-14 flex items-center justify-between">
          <Logo subtitle="Student Portal" />
          <Button
            onClick={() => navigate("/upload")}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </header>

        <main className="flex-1 px-6 lg:px-10 py-8 lg:py-10">
          <div className="max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
