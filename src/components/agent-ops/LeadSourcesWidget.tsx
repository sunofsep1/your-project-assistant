import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Users, Phone, Home, Mail, Share2, TrendingUp, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadSource {
  id: string;
  name: string;
  icon: React.ReactNode;
  leads: number;
  conversions: number;
  color: string;
}

const initialSources: LeadSource[] = [
  { id: "1", name: "Website", icon: <Globe className="w-4 h-4" />, leads: 45, conversions: 8, color: "bg-purple-500" },
  { id: "2", name: "Referrals", icon: <Users className="w-4 h-4" />, leads: 28, conversions: 12, color: "bg-teal-500" },
  { id: "3", name: "Cold Calls", icon: <Phone className="w-4 h-4" />, leads: 67, conversions: 5, color: "bg-blue-500" },
  { id: "4", name: "Open Houses", icon: <Home className="w-4 h-4" />, leads: 23, conversions: 6, color: "bg-amber-500" },
  { id: "5", name: "Email Campaigns", icon: <Mail className="w-4 h-4" />, leads: 89, conversions: 7, color: "bg-green-500" },
  { id: "6", name: "Social Media", icon: <Share2 className="w-4 h-4" />, leads: 56, conversions: 4, color: "bg-pink-500" },
];

export function LeadSourcesWidget() {
  const [sources] = useState<LeadSource[]>(initialSources);

  const totalLeads = sources.reduce((acc, s) => acc + s.leads, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Lead Sources
          </CardTitle>
          <Badge variant="secondary">{totalLeads} Total Leads</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sources.map((source) => {
          const conversionRate = Math.round((source.conversions / source.leads) * 100);
          const leadPercentage = Math.round((source.leads / totalLeads) * 100);
          
          return (
            <div key={source.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className={cn("p-2 rounded-lg", source.color)}>
                {source.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{source.name}</span>
                  <span className="text-xs text-muted-foreground">{leadPercentage}% of leads</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{source.leads} leads</span>
                  <span className="text-success">{source.conversions} converted ({conversionRate}%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
