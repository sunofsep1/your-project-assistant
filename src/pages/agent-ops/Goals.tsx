import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useKPIGoals, useUpsertKPIGoals } from "@/hooks/useKPIGoals";
import { useToast } from "@/hooks/use-toast";
import { Save, Target } from "lucide-react";

const goalFields = [
  { key: "calls_made_goal", label: "Calls Made Goal" },
  { key: "appointments_set_goal", label: "Appointments Set Goal" },
  { key: "listings_taken_goal", label: "Listings Taken Goal" },
  { key: "offers_written_goal", label: "Offers Written Goal" },
  { key: "contracts_signed_goal", label: "Contracts Signed Goal" },
  { key: "closings_goal", label: "Closings Goal" },
  { key: "gci_earned_goal", label: "GCI Earned Goal ($)", isCurrency: true },
];

const Goals = () => {
  const { data: goals, isLoading } = useKPIGoals();
  const upsertGoals = useUpsertKPIGoals();
  const { toast } = useToast();
  
  const [formData, setFormData] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (goals) {
      const data: Record<string, number> = {};
      goalFields.forEach(field => {
        data[field.key] = Number(goals[field.key as keyof typeof goals]) || 0;
      });
      setFormData(data);
    }
  }, [goals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertGoals.mutateAsync(formData);
      toast({ title: "Success", description: "Goals saved!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save goals", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Goals" description="Set and track your agent goals and milestones" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Goals" description="Set and track your agent goals and milestones" />
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" />Monthly KPI Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {goalFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Input
                    type="number"
                    min="0"
                    step={field.isCurrency ? "0.01" : "1"}
                    className="bg-input"
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: field.isCurrency ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0 })}
                  />
                </div>
              ))}
            </div>
            <Button type="submit" disabled={upsertGoals.isPending}>
              <Save className="w-4 h-4 mr-2" />{upsertGoals.isPending ? "Saving..." : "Save Goals"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
