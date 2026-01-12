import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { NumbersKPIGrid } from "@/components/agent-ops/NumbersKPIGrid";
import { NumbersCharts } from "@/components/agent-ops/NumbersCharts";

const Numbers = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Numbers" 
        description="Track your key performance numbers and statistics"
      />
      <NumbersKPIGrid />
      <NumbersCharts />
    </div>
  );
};

export default Numbers;