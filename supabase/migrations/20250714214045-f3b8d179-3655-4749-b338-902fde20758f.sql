-- First, we need to update RLS policies to allow users to see all groups (not just ones they're members of)
-- This will enable the "browse all groups" functionality

-- Drop the restrictive SELECT policy for study_groups and create a more open one
DROP POLICY IF EXISTS "study_groups_select" ON public.study_groups;

-- Allow anyone to view all study groups (for browsing/joining)
CREATE POLICY "study_groups_public_view" ON public.study_groups FOR SELECT USING (true);

-- Update group_members to allow users to join groups
CREATE POLICY "group_members_join" ON public.group_members FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Allow group members to see all other members in their groups
CREATE POLICY "group_members_view_others" ON public.group_members FOR SELECT USING (
  auth.uid() = user_id OR user_is_in_group(group_id)
);

-- Create a new table for private conversations
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1_id UUID NOT NULL,
  participant2_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(participant1_id, participant2_id),
  CHECK (participant1_id != participant2_id)
);

-- Enable RLS for conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "conversations_select" ON public.conversations FOR SELECT USING (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);

CREATE POLICY "conversations_insert" ON public.conversations FOR INSERT WITH CHECK (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);

-- Create private_messages table
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message_type TEXT DEFAULT 'text'
);

-- Enable RLS for private_messages
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for private_messages
CREATE POLICY "private_messages_select" ON public.private_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = conversation_id 
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  )
);

CREATE POLICY "private_messages_insert" ON public.private_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = conversation_id 
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  )
);

-- Add a trigger to update conversations.updated_at when new private messages are added
CREATE OR REPLACE FUNCTION public.update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET updated_at = now() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_timestamp
  AFTER INSERT ON public.private_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_updated_at();