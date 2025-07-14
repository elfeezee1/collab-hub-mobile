-- First, drop all the problematic policies
DROP POLICY IF EXISTS "Users can view group members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can view messages in groups they're members of" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to groups they're members of" ON public.messages;
DROP POLICY IF EXISTS "Users can view sessions in groups they're members of" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can create sessions in groups they're members of" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can view files in groups they're members of" ON public.shared_files;
DROP POLICY IF EXISTS "Users can upload files to groups they're members of" ON public.shared_files;

-- Create a security definer function to check if user is in a group
CREATE OR REPLACE FUNCTION public.user_is_in_group(group_uuid uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a security definer function to get user's group IDs  
CREATE OR REPLACE FUNCTION public.get_user_group_ids()
RETURNS uuid[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT group_id FROM public.group_members 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies using the security definer functions
CREATE POLICY "Users can view group members" ON public.group_members FOR SELECT USING (
  auth.uid() = user_id OR public.user_is_in_group(group_id)
);

CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Messages policies
CREATE POLICY "Users can view messages" ON public.messages FOR SELECT USING (
  group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND group_id = ANY(public.get_user_group_ids())
);

-- Study sessions policies
CREATE POLICY "Users can view study sessions" ON public.study_sessions FOR SELECT USING (
  group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "Users can create study sessions" ON public.study_sessions FOR INSERT WITH CHECK (
  auth.uid() = created_by AND group_id = ANY(public.get_user_group_ids())
);

-- Shared files policies
CREATE POLICY "Users can view shared files" ON public.shared_files FOR SELECT USING (
  group_id = ANY(public.get_user_group_ids())
);

CREATE POLICY "Users can upload files" ON public.shared_files FOR INSERT WITH CHECK (
  auth.uid() = uploaded_by AND group_id = ANY(public.get_user_group_ids())
);