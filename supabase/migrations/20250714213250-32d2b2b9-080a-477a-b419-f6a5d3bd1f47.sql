-- Add missing INSERT policy for study_groups  
CREATE POLICY "study_groups_insert" ON public.study_groups FOR INSERT WITH CHECK (
  auth.uid() = created_by
);

-- Also add UPDATE policy for study_groups
CREATE POLICY "study_groups_update" ON public.study_groups FOR UPDATE USING (
  auth.uid() = created_by
);

-- Add SELECT policy for study_groups using the security definer function
CREATE POLICY "study_groups_select" ON public.study_groups FOR SELECT USING (
  group_id = ANY(public.get_user_group_ids()) OR auth.uid() = created_by
);