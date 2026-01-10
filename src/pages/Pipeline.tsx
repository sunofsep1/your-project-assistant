import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Deal {
  id: string;
  title: string;
  value: number;
  probability: number;
  stage: string;
}

const stages = [
  { id: "prospect", name: "Prospect", color: "bg-blue-500" },
  { id: "qualified", name: "Qualified", color: "bg-cyan-500" },
  { id: "under-offer", name: "Under Offer", color: "bg-yellow-500" },
  { id: "due-diligence", name: "Due Diligence", color: "bg-orange-500" },
  { id: "closed-won", name: "Closed Won", color: "bg-green-500" },
  { id: "closed-lost", name: "Closed Lost", color: "bg-red-500" },
];

const mockDeals: Deal[] = [];

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: "", value: "", stage: "prospect" });
  const { toast } = useToast();

  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage === stageId);
  };

  const handleAddDeal = () => {
    if (!newDeal.title.trim()) {
      toast({ title: "Error", description: "Please enter a deal title", variant: "destructive" });
      return;
    }
    const deal: Deal = {
      id: Date.now().toString(),
      title: newDeal.title,
      value: Number(newDeal.value) || 0,
      probability: 50,
      stage: newDeal.stage,
    };
    setDeals([deal, ...deals]);
    setNewDeal({ title: "", value: "", stage: "prospect" });
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Deal added to pipeline!" });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Sales Pipeline"
        description="Track your deals"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-popover border-border">
              <DialogHeader>
                <DialogTitle>New Deal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Deal Title *</Label>
                  <Input
                    placeholder="Deal title"
                    className="bg-input"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-input"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select
                    value={newDeal.stage}
                    onValueChange={(value) => setNewDeal({ ...newDeal, stage: value })}
                  >
                    <SelectTrigger className="bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDeal}>Add Deal</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

          return (
            <div key={stage.id} className="pipeline-column">
              <div className="pipeline-column-header border-b border-border">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="font-medium text-foreground text-sm">{stage.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stageDeals.length}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                {formatCurrency(stageValue)}
              </div>
              <div className="space-y-2">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="p-3 bg-secondary/50 border-border cursor-pointer hover:bg-secondary transition-colors">
                    <p className="font-medium text-sm text-foreground">{deal.title}</p>
                    <p className="text-sm text-primary mt-1">{formatCurrency(deal.value)}</p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {deals.length === 0 && (
        <div className="text-center py-12 text-muted-foreground mt-8">
          <p>No deals in pipeline. Add your first deal to get started!</p>
        </div>
      )}
    </div>
  );
}
