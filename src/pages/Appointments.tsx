import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, Clock, MapPin, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment, Appointment } from "@/hooks/useAppointments";
import { format } from "date-fns";

type AppointmentType = "valuation" | "meeting" | "call" | "inspection";

const createEmptyAppointment = () => ({
  title: "",
  date: "",
  location: "",
  type: "meeting" as AppointmentType,
  notes: "",
  status: "scheduled",
});

export default function Appointments() {
  const { data: appointments, isLoading } = useAppointments();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState(createEmptyAppointment());
  const { toast } = useToast();

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        title: appointment.title,
        date: appointment.date ? format(new Date(appointment.date), "yyyy-MM-dd'T'HH:mm") : "",
        location: appointment.location || "",
        type: (appointment.type as AppointmentType) || "meeting",
        notes: appointment.notes || "",
        status: appointment.status || "scheduled",
      });
    } else {
      setEditingAppointment(null);
      setFormData(createEmptyAppointment());
    }
    setIsDialogOpen(true);
  };

  const handleSaveAppointment = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return;
    }
    if (!formData.date) {
      toast({ title: "Error", description: "Please select a date", variant: "destructive" });
      return;
    }

    try {
      const appointmentData = {
        title: formData.title,
        date: new Date(formData.date).toISOString(),
        location: formData.location || null,
        type: formData.type,
        notes: formData.notes || null,
        status: formData.status,
      };

      if (editingAppointment) {
        await updateAppointment.mutateAsync({ id: editingAppointment.id, ...appointmentData });
        toast({ title: "Success", description: "Appointment updated!" });
      } else {
        await createAppointment.mutateAsync(appointmentData);
        toast({ title: "Success", description: "Appointment scheduled!" });
      }
      setIsDialogOpen(false);
      setFormData(createEmptyAppointment());
      setEditingAppointment(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save appointment", variant: "destructive" });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment.mutateAsync(id);
      toast({ title: "Deleted", description: "Appointment removed" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete appointment", variant: "destructive" });
    }
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "valuation": return "bg-primary/20 text-primary";
      case "meeting": return "bg-info/20 text-info";
      case "call": return "bg-success/20 text-success";
      case "inspection": return "bg-warning/20 text-warning";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Appointments" description="Manage your schedule and meetings" />
        <div className="space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Appointments"
        description="Manage your schedule and meetings"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setFormData(createEmptyAppointment()); setEditingAppointment(null); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleOpenDialog()}><Plus className="w-4 h-4" />New Appointment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-popover border-border">
              <DialogHeader><DialogTitle>{editingAppointment ? "Edit Appointment" : "New Appointment"}</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2"><Label>Title *</Label><Input placeholder="Appointment title" className="bg-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                <div className="space-y-2"><Label>Date & Time *</Label><Input type="datetime-local" className="bg-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
                <div className="space-y-2"><Label>Location</Label><Input placeholder="Meeting location" className="bg-input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
                <div className="space-y-2"><Label>Type</Label><Select value={formData.type} onValueChange={(value: AppointmentType) => setFormData({ ...formData, type: value })}><SelectTrigger className="bg-input"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="valuation">Valuation</SelectItem><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="call">Call</SelectItem><SelectItem value="inspection">Inspection</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Additional notes..." className="bg-input min-h-[80px]" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-3 mt-6"><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSaveAppointment} disabled={createAppointment.isPending || updateAppointment.isPending}>{(createAppointment.isPending || updateAppointment.isPending) ? "Saving..." : editingAppointment ? "Update" : "Schedule"}</Button></div>
            </DialogContent>
          </Dialog>
        }
      />

      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="p-4 bg-card border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{appointment.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(appointment.type)}`}>{appointment.type || "meeting"}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(new Date(appointment.date), "MMM d, yyyy")}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{format(new Date(appointment.date), "h:mm a")}</span>
                    {appointment.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{appointment.location}</span>}
                  </div>
                  {appointment.notes && <p className="mt-2 text-sm text-muted-foreground">{appointment.notes}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(appointment)}><Pencil className="w-4 h-4" /></Button>
                  <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Appointment</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this appointment?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteAppointment(appointment.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground"><Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No appointments scheduled. Create your first appointment!</p></div>
      )}
    </div>
  );
}
