import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface MarketingChannel {
  name: string;
  spend: number;
  leads: number;
  closings: number;
  revenue: number;
  roi: number;
}

const channelData: MarketingChannel[] = [
  { name: "Social Media", spend: 1200, leads: 45, closings: 2, revenue: 24000, roi: 1900 },
  { name: "Google Ads", spend: 2500, leads: 89, closings: 4, revenue: 48000, roi: 1820 },
  { name: "Direct Mail", spend: 800, leads: 12, closings: 1, revenue: 12000, roi: 1400 },
  { name: "Email Marketing", spend: 150, leads: 28, closings: 2, revenue: 24000, roi: 15900 },
  { name: "Open Houses", spend: 500, leads: 23, closings: 3, revenue: 36000, roi: 7100 },
  { name: "Referral Program", spend: 1000, leads: 35, closings: 5, revenue: 60000, roi: 5900 },
];

const chartData = channelData.map(c => ({
  name: c.name.split(" ")[0],
  spend: c.spend,
  revenue: c.revenue / 100, // Scale down for visualization
}));

export function MarketingROI() {
  const totalSpend = channelData.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = channelData.reduce((acc, c) => acc + c.revenue, 0);
  const totalLeads = channelData.reduce((acc, c) => acc + c.leads, 0);
  const overallROI = Math.round((totalRevenue - totalSpend) / totalSpend * 100);
  const costPerLead = Math.round(totalSpend / totalLeads);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Marketing ROI Tracker
          </CardTitle>
          <Badge className="bg-success/20 text-success">
            <TrendingUp className="w-3 h-3 mr-1" />
            {overallROI}% Overall ROI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-lg font-bold">${totalSpend.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Spend</p>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-lg font-bold">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-lg font-bold">{totalLeads}</p>
            <p className="text-xs text-muted-foreground">Total Leads</p>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-lg font-bold">${costPerLead}</p>
            <p className="text-xs text-muted-foreground">Cost/Lead</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--popover))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }} 
              />
              <Bar dataKey="spend" fill="#a855f7" radius={[4, 4, 0, 0]} name="Spend ($)" />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue ($00s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Breakdown */}
        <div className="space-y-2">
          {channelData.map((channel) => (
            <div key={channel.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
              <span className="text-sm font-medium">{channel.name}</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">${channel.spend}</span>
                <span className="text-muted-foreground">{channel.leads} leads</span>
                <Badge className={cn(
                  "text-xs",
                  channel.roi > 2000 ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                )}>
                  {channel.roi}% ROI
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
