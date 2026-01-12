import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const weeklyData = [
  { day: "Mon", calls: 32, appointments: 3, offers: 1 },
  { day: "Tue", calls: 28, appointments: 2, offers: 2 },
  { day: "Wed", calls: 45, appointments: 4, offers: 1 },
  { day: "Thu", calls: 38, appointments: 2, offers: 3 },
  { day: "Fri", calls: 13, appointments: 1, offers: 1 },
];

const monthlyVolume = [
  { month: "Jan", volume: 285000 },
  { month: "Feb", volume: 342000 },
  { month: "Mar", volume: 298000 },
  { month: "Apr", volume: 425000 },
  { month: "May", volume: 512000 },
  { month: "Jun", volume: 478000 },
];

const conversionData = [
  { name: "Calls to Appts", value: 8, color: "#a855f7" },
  { name: "Appts to Listings", value: 25, color: "#14b8a6" },
  { name: "Listings to Contracts", value: 67, color: "#3b82f6" },
  { name: "Contracts to Close", value: 92, color: "#22c55e" },
];

export function NumbersCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Activity Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="calls" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="appointments" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span className="text-muted-foreground">Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-teal-500" />
              <span className="text-muted-foreground">Appointments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-muted-foreground">Offers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Volume Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Sales Volume Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Volume"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#22c55e" 
                  fill="url(#volumeGradient)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rates */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conversionData.map((item) => (
              <div key={item.name} className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="hsl(var(--border))"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke={item.color}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${item.value * 2.2} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{item.value}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
