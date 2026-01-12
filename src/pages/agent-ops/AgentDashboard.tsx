import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EditableKPICard } from "@/components/agent-ops/EditableKPICard";
import { TodaysFocus } from "@/components/agent-ops/TodaysFocus";
import { GoalsSection } from "@/components/agent-ops/GoalsSection";
import { Calendar, Building2, Handshake, DollarSign } from "lucide-react";

const AgentDashboard = () => {
  const [kpiData, setKpiData] = useState({
    appointments: { current: 12, goal: 20 },
    listings: { current: 3, goal: 5 },
    closings: { current: 1, goal: 2 },
    volume: { current: 425000, goal: 1000000 },
  });

  const updateKPI = (key: keyof typeof kpiData, field: "current" | "goal", value: number) => {
    setKpiData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Agent Dashboard" 
        description="Track your performance metrics and daily priorities"
      />
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <EditableKPICard
          title="Appointments"
          current={kpiData.appointments.current}
          goal={kpiData.appointments.goal}
          icon={<Calendar className="w-5 h-5 text-purple-300" />}
          variant="appointments"
          onCurrentChange={(v) => updateKPI("appointments", "current", v)}
          onGoalChange={(v) => updateKPI("appointments", "goal", v)}
        />
        <EditableKPICard
          title="Listings"
          current={kpiData.listings.current}
          goal={kpiData.listings.goal}
          icon={<Building2 className="w-5 h-5 text-teal-300" />}
          variant="listings"
          onCurrentChange={(v) => updateKPI("listings", "current", v)}
          onGoalChange={(v) => updateKPI("listings", "goal", v)}
        />
        <EditableKPICard
          title="Closings"
          current={kpiData.closings.current}
          goal={kpiData.closings.goal}
          icon={<Handshake className="w-5 h-5 text-blue-300" />}
          variant="closings"
          onCurrentChange={(v) => updateKPI("closings", "current", v)}
          onGoalChange={(v) => updateKPI("closings", "goal", v)}
        />
        <EditableKPICard
          title="Volume"
          current={kpiData.volume.current}
          goal={kpiData.volume.goal}
          icon={<DollarSign className="w-5 h-5 text-green-300" />}
          variant="volume"
          format="currency"
          onCurrentChange={(v) => updateKPI("volume", "current", v)}
          onGoalChange={(v) => updateKPI("volume", "goal", v)}
        />
      </div>

      {/* Today's Focus and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysFocus />
        <GoalsSection />
      </div>
    </div>
  );
};

export default AgentDashboard;
