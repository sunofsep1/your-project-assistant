import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCalendar } from "@/components/agent-ops/ContentCalendar";
import { CampaignManager } from "@/components/agent-ops/CampaignManager";
import { MarketingROI } from "@/components/agent-ops/MarketingROI";

const Marketing = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Marketing" 
        description="Plan and execute your marketing strategies"
      />
      <ContentCalendar />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignManager />
        <MarketingROI />
      </div>
    </div>
  );
};

export default Marketing;