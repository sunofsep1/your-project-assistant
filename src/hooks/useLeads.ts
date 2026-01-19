import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "./useRealtimeSubscription";

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string | null;
  notes: string | null;
  property_interest: string | null;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadInsert {
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  status?: string | null;
  notes?: string | null;
  property_interest?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  timeline?: string | null;
}

export interface LeadUpdate extends Partial<LeadInsert> {
  id: string;
}

export function useLeads() {
  useRealtimeSubscription("leads" as any, [["leads"]]);

  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("leads" as any) as any)
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Lead[];
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lead: LeadInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await (supabase
        .from("leads" as any) as any)
        .insert({ ...lead, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: LeadUpdate) => {
      const { data, error } = await (supabase
        .from("leads" as any) as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from("leads" as any) as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
