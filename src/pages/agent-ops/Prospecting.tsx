import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeadSourcesWidget } from "@/components/agent-ops/LeadSourcesWidget";
import { ProspectingLeads } from "@/components/agent-ops/ProspectingLeads";
import { FollowUpTracker } from "@/components/agent-ops/FollowUpTracker";

const Prospecting = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Prospecting" 
        description="Manage your prospecting activities and leads"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProspectingLeads />
        </div>
        <div className="space-y-6">
          <LeadSourcesWidget />
          <FollowUpTracker />
        </div>
      </div>
    </div>
  );
};

export default Prospecting;