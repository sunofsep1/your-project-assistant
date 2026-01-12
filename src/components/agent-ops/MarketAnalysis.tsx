import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Home, DollarSign, Clock, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface MarketStat {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const marketStats: MarketStat[] = [
  { label: "Median Price", value: "$425,000", change: 5.2, icon: <DollarSign className="w-4 h-4" /> },
  { label: "Active Listings", value: "342", change: -8.4, icon: <Home className="w-4 h-4" /> },
  { label: "Days on Market", value: "28", change: -12.5, icon: <Clock className="w-4 h-4" /> },
  { label: "Sale/List Ratio", value: "98.5%", change: 1.8, icon: <BarChart3 className="w-4 h-4" /> },
];

const priceHistory = [
  { month: "Jul", price: 395 },
  { month: "Aug", price: 402 },
  { month: "Sep", price: 398 },
  { month: "Oct", price: 410 },
  { month: "Nov", price: 418 },
  { month: "Dec", price: 425 },
];

const neighborhoods = [
  { name: "Downtown", avgPrice: 550000, change: 8.2, inventory: 45 },
  { name: "Westside", avgPrice: 425000, change: 4.5, inventory: 78 },
  { name: "Northgate", avgPrice: 380000, change: 2.1, inventory: 92 },
  { name: "Eastlake", avgPrice: 485000, change: -1.2, inventory: 34 },
  { name: "Southend", avgPrice: 320000, change: 6.8, inventory: 67 },
];

export function MarketAnalysis() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Market Analysis
          </CardTitle>
          <Badge variant="secondary">Your Market Area</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {marketStats.map((stat) => (
            <div key={stat.label} className="p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded bg-primary/20 text-primary">
                  {stat.icon}
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{stat.value}</span>
                <span className={cn(
                  "text-xs flex items-center",
                  stat.change >= 0 ? "text-success" : "text-destructive"
                )}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {Math.abs(stat.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Price Trend Chart */}
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickFormatter={(value) => `$${value}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--popover))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                formatter={(value: number) => [`$${value}K`, "Median Price"]}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={{ fill: "#a855f7", strokeWidth: 0, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Neighborhood Breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-2">Neighborhood Trends</h4>
          <div className="space-y-2">
            {neighborhoods.map((hood) => (
              <div key={hood.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <span className="text-sm font-medium">{hood.name}</span>
                <div className="flex items-center gap-4 text-xs">
                  <span>${(hood.avgPrice / 1000).toFixed(0)}K</span>
                  <span className={cn(
                    "flex items-center",
                    hood.change >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {hood.change >= 0 ? "+" : ""}{hood.change}%
                  </span>
                  <span className="text-muted-foreground">{hood.inventory} listings</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
