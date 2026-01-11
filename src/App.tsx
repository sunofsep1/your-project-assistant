import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Listings from "./pages/Listings";
import Appointments from "./pages/Appointments";
import Pipeline from "./pages/Pipeline";
import Campaigns from "./pages/Campaigns";
import Scripts from "./pages/Scripts";
import NotFound from "./pages/NotFound";
import AgentDashboard from "./pages/agent-ops/AgentDashboard";
import Numbers from "./pages/agent-ops/Numbers";
import Goals from "./pages/agent-ops/Goals";
import Prospecting from "./pages/agent-ops/Prospecting";
import Marketing from "./pages/agent-ops/Marketing";
import Strategy from "./pages/agent-ops/Strategy";
import Settings from "./pages/agent-ops/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/contacts" element={<MainLayout><Contacts /></MainLayout>} />
          <Route path="/listings" element={<MainLayout><Listings /></MainLayout>} />
          <Route path="/appointments" element={<MainLayout><Appointments /></MainLayout>} />
          <Route path="/pipeline" element={<MainLayout><Pipeline /></MainLayout>} />
          <Route path="/campaigns" element={<MainLayout><Campaigns /></MainLayout>} />
          <Route path="/scripts" element={<MainLayout><Scripts /></MainLayout>} />
          <Route path="/agent-ops/dashboard" element={<MainLayout><AgentDashboard /></MainLayout>} />
          <Route path="/agent-ops/numbers" element={<MainLayout><Numbers /></MainLayout>} />
          <Route path="/agent-ops/goals" element={<MainLayout><Goals /></MainLayout>} />
          <Route path="/agent-ops/prospecting" element={<MainLayout><Prospecting /></MainLayout>} />
          <Route path="/agent-ops/marketing" element={<MainLayout><Marketing /></MainLayout>} />
          <Route path="/agent-ops/strategy" element={<MainLayout><Strategy /></MainLayout>} />
          <Route path="/agent-ops/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
