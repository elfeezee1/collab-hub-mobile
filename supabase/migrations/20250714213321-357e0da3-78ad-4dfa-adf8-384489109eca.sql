-- Add missing INSERT policy for study_groups  
CREATE POLICY "study_groups_insert" ON public.study_groups FOR INSERT WITH CHECK (
  auth.uid() = created_by
);

-- Also add UPDATE policy for study_groups
CREATE POLICY "study_groups_update" ON public.study_groups FOR UPDATE USING (
  auth.uid() = created_by
);

-- Add SELECT policy for study_groups - users can see groups they created OR are members of
CREATE POLICY "study_groups_select" ON public.study_groups FOR SELECT USING (
  auth.uid() = created_by OR id = ANY(public.get_user_group_ids())
);