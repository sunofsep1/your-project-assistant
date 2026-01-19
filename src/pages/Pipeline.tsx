import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, GripVertical, Home, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useListings, useCreateListing, useUpdateListing, Listing } from "@/hooks/useListings";

const PIPELINE_STAGES = [
  { id: "new", name: "New", color: "bg-blue-500" },
  { id: "contacted", name: "Contacted", color: "bg-cyan-500" },
  { id: "inspection", name: "Inspection", color: "bg-yellow-500" },
  { id: "offer", name: "Offer", color: "bg-orange-500" },
  { id: "under-contract", name: "Under Contract", color: "bg-purple-500" },
  { id: "settled", name: "Settled", color: "bg-green-500" },
];

export default function Pipeline() {
  const { data: listings = [], isLoading } = useListings();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ address: "", price: "", stage: "new", propertyType: "house" });
  const [draggedItem, setDraggedItem] = useState<Listing | null>(null);
  const { toast } = useToast();

  const getListingsByStage = (stageId: string) => {
    return listings.filter((listing) => (listing.pipeline_stage || "new") === stageId);
  };

  const handleAddDeal = async () => {
    if (!newDeal.address.trim()) {
      toast({ title: "Error", description: "Please enter an address", variant: "destructive" });
      return;
    }
    try {
      await createListing.mutateAsync({
        address: newDeal.address,
        price: newDeal.price ? Number(newDeal.price) : null,
        pipeline_stage: newDeal.stage,
        property_type: newDeal.propertyType,
      });
      setNewDeal({ address: "", price: "", stage: "new", propertyType: "house" });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Deal added to pipeline!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add deal", variant: "destructive" });
    }
  };

  const handleDragStart = (e: React.DragEvent, listing: Listing) => {
    setDraggedItem(listing);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.pipeline_stage === stageId) {
      setDraggedItem(null);
      return;
    }
    
    try {
      await updateListing.mutateAsync({
        id: draggedItem.id,
        pipeline_stage: stageId,
      });
      toast({ title: "Stage Updated", description: `Moved to ${PIPELINE_STAGES.find(s => s.id === stageId)?.name}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update stage", variant: "destructive" });
    }
    setDraggedItem(null);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
  };

  const totalPipelineValue = listings.reduce((sum, l) => sum + (l.price || 0), 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Sales Pipeline"
        description={`${listings.length} deals · ${formatCurrency(totalPipelineValue)} total value`}
        actions={
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Deal
          </Button>
        }
      />

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageListings = getListingsByStage(stage.id);
          const stageValue = stageListings.reduce((sum, l) => sum + (l.price || 0), 0);

          return (
            <div 
              key={stage.id} 
              className="pipeline-column min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="pipeline-column-header border-b border-border">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="font-medium text-foreground text-sm">{stage.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stageListings.length}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-4">{formatCurrency(stageValue)}</div>
              
              <div className="space-y-2">
                {stageListings.map((listing) => (
                  <Card 
                    key={listing.id} 
                    className="p-3 bg-secondary/50 border-border cursor-grab hover:bg-secondary transition-colors active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(e, listing)}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{listing.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <DollarSign className="w-3 h-3 text-primary" />
                          <span className="text-sm text-primary">{formatCurrency(listing.price)}</span>
                        </div>
                        {listing.property_type && (
                          <div className="flex items-center gap-1 mt-1">
                            <Home className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground capitalize">{listing.property_type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {listings.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground mt-8">
          <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No deals in pipeline. Add your first deal to get started!</p>
        </div>
      )}

      {/* Add Deal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-popover border-border">
          <DialogHeader>
            <DialogTitle>Add Deal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Property Address *</Label>
              <Input
                placeholder="123 Main Street, Sydney"
                className="bg-input"
                value={newDeal.address}
                onChange={(e) => setNewDeal({ ...newDeal, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-input"
                value={newDeal.price}
                onChange={(e) => setNewDeal({ ...newDeal, price: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={newDeal.propertyType} onValueChange={(v) => setNewDeal({ ...newDeal, propertyType: v })}>
                  <SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={newDeal.stage} onValueChange={(v) => setNewDeal({ ...newDeal, stage: v })}>
                  <SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDeal} disabled={createListing.isPending}>
              {createListing.isPending ? "Adding..." : "Add Deal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
