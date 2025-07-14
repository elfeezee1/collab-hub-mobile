-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view group members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can view messages in groups they're members of" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to groups they're members of" ON public.messages;
DROP POLICY IF EXISTS "Users can view sessions in groups they're members of" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can create sessions in groups they're members of" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can view files in groups they're members of" ON public.shared_files;
DROP POLICY IF EXISTS "Users can upload files to groups they're members of" ON public.shared_files;

-- Drop any other potential policy names
DROP POLICY IF EXISTS "Users can view group members" ON public.group_members;
DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can create study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can view shared files" ON public.shared_files;
DROP POLICY IF EXISTS "Users can upload files" ON public.shared_files;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.user_is_in_group(group_uuid uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_group_ids()
RETURNS uuid[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT group_id FROM public.group_members 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new policies using security definer functions
CREATE POLICY "group_members_select" ON public.group_members FOR SELECT USING (
  auth.uid() = user_id OR public.user_is_in_group(group_id)
);

CREATE POLICY "group_members_insert" ON public.group_members FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (
  group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "study_sessions_select" ON public.study_sessions FOR SELECT USING (
  group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "study_sessions_insert" ON public.study_sessions FOR INSERT WITH CHECK (
  auth.uid() = created_by AND group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "shared_files_select" ON public.shared_files FOR SELECT USING (
  group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "shared_files_insert" ON public.shared_files FOR INSERT WITH CHECK (
  auth.uid() = uploaded_by AND group_id = ANY(public.get_user_group_ids())
);