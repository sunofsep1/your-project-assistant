import * as React from "react";
import { Phone, Calendar, Building2, FileText, FileCheck, Handshake, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NumbersKPI {
  title: string;
  current: number;
  previous: number;
  goal: number;
  icon: React.ReactNode;
  format?: "number" | "currency";
  color: string;
}

const kpiData: NumbersKPI[] = [
  { title: "Calls Made", current: 156, previous: 142, goal: 200, icon: <Phone className="w-5 h-5" />, color: "text-purple-400" },
  { title: "Appointments Set", current: 12, previous: 10, goal: 20, icon: <Calendar className="w-5 h-5" />, color: "text-teal-400" },
  { title: "Listings Taken", current: 3, previous: 2, goal: 5, icon: <Building2 className="w-5 h-5" />, color: "text-blue-400" },
  { title: "Offers Written", current: 8, previous: 6, goal: 15, icon: <FileText className="w-5 h-5" />, color: "text-amber-400" },
  { title: "Contracts Signed", current: 4, previous: 5, goal: 8, icon: <FileCheck className="w-5 h-5" />, color: "text-green-400" },
  { title: "Closings", current: 2, previous: 3, goal: 4, icon: <Handshake className="w-5 h-5" />, color: "text-cyan-400" },
  { title: "GCI Earned", current: 42500, previous: 38000, goal: 100000, icon: <DollarSign className="w-5 h-5" />, format: "currency", color: "text-emerald-400" },
];

export function NumbersKPIGrid() {
  const formatValue = (value: number, format?: "number" | "currency") => {
    if (format === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  };

  const getPercentChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi) => {
        const percentChange = getPercentChange(kpi.current, kpi.previous);
        const isPositive = percentChange >= 0;
        const percentage = Math.min(Math.round((kpi.current / kpi.goal) * 100), 100);
        
        return (
          <Card key={kpi.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg bg-secondary", kpi.color)}>
                  {kpi.icon}
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? "+" : ""}{percentChange}%
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
              <p className="text-2xl font-bold mb-2">{formatValue(kpi.current, kpi.format)}</p>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Goal: {formatValue(kpi.goal, kpi.format)}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", kpi.color.replace("text-", "bg-"))}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
