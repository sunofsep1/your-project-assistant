import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, Clock, User, MapPin, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  title: string;
  contactName: string;
  date: string;
  time: string;
  location: string;
  type: "valuation" | "meeting" | "call" | "inspection";
  notes: string;
}

const mockAppointments: Appointment[] = [];

const createEmptyAppointment = (): Omit<Appointment, 'id'> => ({
  title: "",
  contactName: "",
  date: "",
  time: "",
  location: "",
  type: "meeting",
  notes: "",
});

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>(createEmptyAppointment());
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveAppointment = () => {
    if (!newAppointment.title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return;
    }
    if (!newAppointment.date) {
      toast({ title: "Error", description: "Please select a date", variant: "destructive" });
      return;
    }

    if (editingId) {
      setAppointments(appointments.map(a => a.id === editingId ? { ...newAppointment, id: editingId } : a));
      toast({ title: "Success", description: "Appointment updated!" });
    } else {
      const appointment: Appointment = {
        id: Date.now().toString(),
        ...newAppointment,
      };
      setAppointments([appointment, ...appointments]);
      toast({ title: "Success", description: "Appointment scheduled!" });
    }

    setNewAppointment(createEmptyAppointment());
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (appointment: Appointment) => {
    setNewAppointment(appointment);
    setEditingId(appointment.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    toast({ title: "Deleted", description: "Appointment removed" });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "valuation": return "bg-primary/20 text-primary";
      case "meeting": return "bg-info/20 text-info";
      case "call": return "bg-success/20 text-success";
      case "inspection": return "bg-warning/20 text-warning";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Appointments"
        description="Manage your schedule and meetings"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setNewAppointment(createEmptyAppointment());
              setEditingId(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-popover border-border">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Appointment" : "New Appointment"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="Appointment title"
                    className="bg-input"
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    placeholder="Client name"
                    className="bg-input"
                    value={newAppointment.contactName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, contactName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      className="bg-input"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      className="bg-input"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Meeting location"
                    className="bg-input"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value: Appointment["type"]) => setNewAppointment({ ...newAppointment, type: value })}
                  >
                    <SelectTrigger className="bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valuation">Valuation</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes..."
                    className="bg-input min-h-[80px]"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveAppointment}>{editingId ? "Update" : "Schedule"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{appointment.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(appointment.type)}`}>
                    {appointment.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {appointment.date}
                  </span>
                  {appointment.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </span>
                  )}
                  {appointment.contactName && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {appointment.contactName}
                    </span>
                  )}
                  {appointment.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {appointment.location}
                    </span>
                  )}
                </div>
                {appointment.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">{appointment.notes}</p>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(appointment)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(appointment.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No appointments scheduled. Create your first appointment!</p>
        </div>
      )}
    </div>
  );
}
