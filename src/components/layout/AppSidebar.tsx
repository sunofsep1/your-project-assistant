import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Megaphone,
  FileText,
  Database,
  Menu,
  X,
  LayoutGrid,
  Hash,
  Target,
  Search,
  Presentation,
  Lightbulb,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Listings", url: "/listings", icon: Building2 },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Sales Pipeline", url: "/pipeline", icon: TrendingUp },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "Scripts", url: "/scripts", icon: FileText },
];

const agentOpsItems = [
  { title: "Agent Dashboard", url: "/agent-ops/dashboard", icon: LayoutDashboard },
  { title: "Numbers", url: "/agent-ops/numbers", icon: Hash },
  { title: "Goals", url: "/agent-ops/goals", icon: Target },
  { title: "Prospecting", url: "/agent-ops/prospecting", icon: Search },
  { title: "Marketing", url: "/agent-ops/marketing", icon: Presentation },
  { title: "Strategy", url: "/agent-ops/strategy", icon: Lightbulb },
  { title: "Settings", url: "/agent-ops/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden print:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 w-[220px] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 print:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">DATA</span>
              <span className="text-sm font-bold text-primary">DUNGEON</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}

          {/* Agent Ops Hub Section */}
          <Collapsible defaultOpen={location.pathname.startsWith("/agent-ops")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200 mt-2">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5" />
                <span>Agent Ops Hub</span>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 mt-1">
              {agentOpsItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </aside>

      {/* Spacer for mobile when sidebar is hidden */}
      <div className="w-0 md:hidden" />
    </>
  );
}
