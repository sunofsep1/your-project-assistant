import { PageHeader } from "@/components/layout/PageHeader";
import { KPICard } from "@/components/agent-ops/KPICard";
import { TodaysFocus } from "@/components/agent-ops/TodaysFocus";
import { GoalsSection } from "@/components/agent-ops/GoalsSection";
import { Calendar, Building2, Handshake, DollarSign } from "lucide-react";

const AgentDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Agent Dashboard" 
        description="Track your performance metrics and daily priorities"
      />
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Appointments"
          current={12}
          goal={20}
          icon={<Calendar className="w-5 h-5 text-purple-300" />}
          variant="appointments"
        />
        <KPICard
          title="Listings"
          current={3}
          goal={5}
          icon={<Building2 className="w-5 h-5 text-teal-300" />}
          variant="listings"
        />
        <KPICard
          title="Closings"
          current={1}
          goal={2}
          icon={<Handshake className="w-5 h-5 text-blue-300" />}
          variant="closings"
        />
        <KPICard
          title="Volume"
          current={425000}
          goal={1000000}
          icon={<DollarSign className="w-5 h-5 text-green-300" />}
          variant="volume"
          format="currency"
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
