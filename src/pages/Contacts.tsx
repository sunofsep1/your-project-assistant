import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AvatarCircle } from "@/components/ui/avatar-circle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  status: "hot" | "warm" | "cold" | "entered";
  phone: string;
  email: string;
  location: string;
  lastContact: string;
}

const mockContacts: Contact[] = [
  { id: "1", name: "John Smith", status: "hot", phone: "0412 345 678", email: "john@example.com", location: "Sydney", lastContact: "2 hours ago" },
  { id: "2", name: "Sarah Johnson", status: "warm", phone: "0423 456 789", email: "sarah@example.com", location: "Melbourne", lastContact: "1 day ago" },
  { id: "3", name: "Michael Chen", status: "cold", phone: "0434 567 890", email: "michael@example.com", location: "Brisbane", lastContact: "1 week ago" },
  { id: "4", name: "Emma Wilson", status: "entered", phone: "0445 678 901", email: "emma@example.com", location: "Perth", lastContact: "Just now" },
  { id: "5", name: "James Brown", status: "warm", phone: "0456 789 012", email: "james@example.com", location: "Adelaide", lastContact: "3 days ago" },
  { id: "6", name: "Lisa Davis", status: "hot", phone: "0467 890 123", email: "lisa@example.com", location: "Gold Coast", lastContact: "5 hours ago" },
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState<{ name: string; phone: string; email: string; location: string; status: "hot" | "warm" | "cold" | "entered" }>({ name: "", phone: "", email: "", location: "", status: "entered" });
  const { toast } = useToast();

  const stats = {
    total: contacts.length,
    hot: contacts.filter((c) => c.status === "hot").length,
    warm: contacts.filter((c) => c.status === "warm").length,
    cold: contacts.filter((c) => c.status === "cold").length,
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (!newContact.name.trim()) {
      toast({ title: "Error", description: "Please enter a contact name", variant: "destructive" });
      return;
    }
    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
      lastContact: "Just now",
    };
    setContacts([contact, ...contacts]);
    setNewContact({ name: "", phone: "", email: "", location: "", status: "entered" });
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Contact added successfully!" });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Contacts"
        description="Manage your contacts and leads"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-popover border-border">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    placeholder="Contact name"
                    className="bg-input"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="0400 000 000"
                    className="bg-input"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="email@example.com"
                    className="bg-input"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="City"
                    className="bg-input"
                    value={newContact.location}
                    onChange={(e) => setNewContact({ ...newContact, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newContact.status}
                    onValueChange={(value: "hot" | "warm" | "cold" | "entered") => setNewContact({ ...newContact, status: value })}
                  >
                    <SelectTrigger className="bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cold">Cold</SelectItem>
                      <SelectItem value="entered">Entered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddContact}>Add Contact</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard value={stats.total} label="Total Contacts" variant="total" />
        <StatCard value={stats.hot} label="Hot Leads" variant="cancelled" />
        <StatCard value={stats.warm} label="Warm Leads" variant="planning" />
        <StatCard value={stats.cold} label="Cold Leads" variant="active" />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          className="pl-10 bg-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="contact-row">
            <AvatarCircle name={contact.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{contact.name}</span>
                <StatusBadge variant={contact.status}>{contact.status}</StatusBadge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {contact.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {contact.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {contact.location}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {contact.lastContact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
