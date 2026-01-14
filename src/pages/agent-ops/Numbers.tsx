import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { NumbersKPIGrid } from "@/components/agent-ops/NumbersKPIGrid";
import { NumbersCharts } from "@/components/agent-ops/NumbersCharts";
import { LogActivityForm } from "@/components/agent-ops/LogActivityForm";

const Numbers = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Numbers" 
        description="Track your key performance numbers and statistics"
      />
      <LogActivityForm />
      <NumbersKPIGrid />
      <NumbersCharts />
    </div>
  );
};

export default Numbers;
