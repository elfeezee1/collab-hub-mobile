-- Drop the problematic RLS policy that's causing infinite recursion
DROP POLICY IF EXISTS "Users can view group members of groups they're in" ON public.group_members;

-- Create a simpler, non-recursive policy for viewing group members
CREATE POLICY "Users can view group members of their groups" ON public.group_members FOR SELECT USING (
  auth.uid() = user_id OR 
  group_id IN (
    SELECT gm.group_id 
    FROM public.group_members gm 
    WHERE gm.user_id = auth.uid()
  )
);

-- Also update the messages policy to be simpler and avoid potential recursion
DROP POLICY IF EXISTS "Users can view messages in groups they're members of" ON public.messages;
CREATE POLICY "Users can view messages in groups they're members of" ON public.messages FOR SELECT USING (
  group_id IN (
    SELECT gm.group_id 
    FROM public.group_members gm 
    WHERE gm.user_id = auth.uid()
  )
);

-- Update the send messages policy
DROP POLICY IF EXISTS "Users can send messages to groups they're members of" ON public.messages;
CREATE POLICY "Users can send messages to groups they're members of" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  group_id IN (
    SELECT gm.group_id 
    FROM public.group_members gm 
    WHERE gm.user_id = auth.uid()
  )
);

-- Update study sessions policies to avoid recursion
DROP POLICY IF EXISTS "Users can view sessions in groups they're members of" ON public.study_sessions;
CREATE POLICY "Users can view sessions in groups they're members of" ON public.study_sessions FOR SELECT USING (
  group_id IN (
    SELECT gm.group_id 
    FROM public.group_members gm 
    WHERE gm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create sessions in groups they're members of" ON public.study_sessions;
CREATE POLICY "Users can create sessions in groups they're members of" ON public.study_sessions FOR INSERT WITH CHECK (
  auth.uid() = created_by AND 
  group_id IN (
    SELECT gm.group_id 
    FROM public.group_members gm 
    WHERE gm.user_id = auth.uid()
  )
);

-- Update shared files policies  
DROP POLICY IF EXISTS "Users can view files in groups they're members of" ON public.shared_files;
CREATE POLICY "Users can view files in groups they're members of" ON public.shared_files FOR SELECT USING (
  group_id IN (
    SELECT gm.group_id 
    FROM public.group_members gm 
    WHERE gm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can upload files to groups they're members of" ON public.shared_files;
CREATE POLICY "Users can upload files to groups they're members of" ON public.shared_files FOR INSERT WITH CHECK (
  auth.uid() = uploaded_by AND 
  group_id IN (
    SELECT gm.group_id 
    FROM public.group_members gm 
    WHERE gm.user_id = auth.uid()
  )
);