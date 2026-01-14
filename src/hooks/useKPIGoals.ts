import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type KPIGoals = Tables<"kpi_goals">;
export type KPIGoalsInsert = TablesInsert<"kpi_goals">;
export type KPIGoalsUpdate = TablesUpdate<"kpi_goals">;

const defaultGoals = {
  calls_made_goal: 200,
  appointments_set_goal: 20,
  listings_taken_goal: 5,
  offers_written_goal: 15,
  contracts_signed_goal: 8,
  closings_goal: 4,
  gci_earned_goal: 100000,
};

export function useKPIGoals() {
  return useQuery({
    queryKey: ["kpi_goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kpi_goals")
        .select("*")
        .maybeSingle();
      
      if (error) throw error;
      return data as KPIGoals | null;
    },
  });
}

export function useUpsertKPIGoals() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (goals: Partial<Omit<KPIGoals, "id" | "user_id" | "updated_at">>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Check if goals exist for user
      const { data: existing } = await supabase
        .from("kpi_goals")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (existing) {
        const { data, error } = await supabase
          .from("kpi_goals")
          .update(goals)
          .eq("id", existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("kpi_goals")
          .insert({ ...defaultGoals, ...goals, user_id: user.id })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kpi_goals"] });
    },
  });
}
