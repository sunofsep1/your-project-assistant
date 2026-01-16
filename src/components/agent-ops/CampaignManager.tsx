import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Mail, Eye, MousePointer, Users, TrendingUp, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "drip" | "newsletter";
  status: "active" | "paused" | "completed" | "draft";
  sent: number;
  opened: number;
  clicked: number;
  startDate: string;
}

const initialCampaigns: Campaign[] = [];

const statusColors = {
  active: "bg-success/20 text-success border-success/30",
  paused: "bg-warning/20 text-warning border-warning/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  draft: "bg-muted text-muted-foreground border-muted",
};

export function CampaignManager() {
  const [campaigns] = useState<Campaign[]>(initialCampaigns);

  const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + c.opened, 0);
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Campaigns
          </CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-purple-400" />
            <p className="text-xl font-bold">{totalSent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Emails Sent</p>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <Eye className="w-5 h-5 mx-auto mb-1 text-teal-400" />
            <p className="text-xl font-bold">{avgOpenRate}%</p>
            <p className="text-xs text-muted-foreground">Avg Open Rate</p>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg text-center">
            <MousePointer className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <p className="text-xl font-bold">{campaigns.filter(c => c.status === "active").length}</p>
            <p className="text-xs text-muted-foreground">Active Campaigns</p>
          </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-2">
          {campaigns.map((campaign) => {
            const openRate = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
            const clickRate = campaign.opened > 0 ? Math.round((campaign.clicked / campaign.opened) * 100) : 0;
            
            return (
              <div key={campaign.id} className="p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{campaign.name}</span>
                    <Badge className={cn("text-xs", statusColors[campaign.status])}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {campaign.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {campaign.status === "active" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <span>Sent: {campaign.sent.toLocaleString()}</span>
                  <span>Opens: {openRate}%</span>
                  <span>Clicks: {clickRate}%</span>
                  <span>Started: {campaign.startDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
