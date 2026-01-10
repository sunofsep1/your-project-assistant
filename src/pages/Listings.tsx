import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { Plus, MapPin, Bed, Bath, Maximize, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  address: string;
  suburb: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  landSize: number;
  propertyType: "house" | "apartment" | "townhouse" | "land";
  status: "active" | "pending" | "sold" | "withdrawn";
  description: string;
}

const mockListings: Listing[] = [
  {
    id: "1",
    address: "33/30-46 Edina Street",
    suburb: "Thornlands",
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    landSize: 120,
    propertyType: "apartment",
    status: "active",
    description: "Beautiful apartment with modern finishes",
  },
];

const createEmptyListing = (): Omit<Listing, 'id'> => ({
  address: "",
  suburb: "",
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  landSize: 0,
  propertyType: "house",
  status: "active",
  description: "",
});

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListing, setNewListing] = useState<Omit<Listing, 'id'>>(createEmptyListing());
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveListing = () => {
    if (!newListing.address.trim()) {
      toast({ title: "Error", description: "Please enter an address", variant: "destructive" });
      return;
    }

    if (editingId) {
      setListings(listings.map(l => l.id === editingId ? { ...newListing, id: editingId } : l));
      toast({ title: "Success", description: "Listing updated!" });
    } else {
      const listing: Listing = {
        id: Date.now().toString(),
        ...newListing,
      };
      setListings([listing, ...listings]);
      toast({ title: "Success", description: "Listing added!" });
    }

    setNewListing(createEmptyListing());
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (listing: Listing) => {
    setNewListing(listing);
    setEditingId(listing.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
    toast({ title: "Deleted", description: "Listing removed" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "active";
      case "pending": return "warm";
      case "sold": return "completed";
      case "withdrawn": return "cancelled";
      default: return "default";
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Listings"
        description="Manage your property listings"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setNewListing(createEmptyListing());
              setEditingId(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-popover border-border">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Listing" : "Add New Listing"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Input
                    placeholder="Street address"
                    className="bg-input"
                    value={newListing.address}
                    onChange={(e) => setNewListing({ ...newListing, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Suburb</Label>
                  <Input
                    placeholder="Suburb"
                    className="bg-input"
                    value={newListing.suburb}
                    onChange={(e) => setNewListing({ ...newListing, suburb: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-input"
                      value={newListing.price || ""}
                      onChange={(e) => setNewListing({ ...newListing, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select
                      value={newListing.propertyType}
                      onValueChange={(value: Listing["propertyType"]) => setNewListing({ ...newListing, propertyType: value })}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input
                      type="number"
                      className="bg-input"
                      value={newListing.bedrooms || ""}
                      onChange={(e) => setNewListing({ ...newListing, bedrooms: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input
                      type="number"
                      className="bg-input"
                      value={newListing.bathrooms || ""}
                      onChange={(e) => setNewListing({ ...newListing, bathrooms: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Land Size (m²)</Label>
                    <Input
                      type="number"
                      className="bg-input"
                      value={newListing.landSize || ""}
                      onChange={(e) => setNewListing({ ...newListing, landSize: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newListing.status}
                    onValueChange={(value: Listing["status"]) => setNewListing({ ...newListing, status: value })}
                  >
                    <SelectTrigger className="bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Property description..."
                    className="bg-input min-h-[80px]"
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveListing}>{editingId ? "Update" : "Add"} Listing</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between mb-3">
              <StatusBadge variant={getStatusVariant(listing.status)}>{listing.status}</StatusBadge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(listing)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(listing.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{listing.address}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
              <MapPin className="w-3 h-3" />
              {listing.suburb}
            </p>
            <p className="text-2xl font-bold text-primary mb-3">{formatPrice(listing.price)}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {listing.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {listing.bathrooms}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                {listing.landSize}m²
              </span>
            </div>
          </Card>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No listings yet. Add your first property listing!</p>
        </div>
      )}
    </div>
  );
}
