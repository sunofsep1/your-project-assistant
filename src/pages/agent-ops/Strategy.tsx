import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BusinessPlanWidget } from "@/components/agent-ops/BusinessPlanWidget";
import { MarketAnalysis } from "@/components/agent-ops/MarketAnalysis";
import { CompetitiveAnalysis } from "@/components/agent-ops/CompetitiveAnalysis";

const Strategy = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Strategy" 
        description="Develop and refine your business strategies"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessPlanWidget />
        <MarketAnalysis />
      </div>
      <CompetitiveAnalysis />
    </div>
  );
};

export default Strategy;