-- Add is_active flag to lists
-- Run in Supabase Studio > SQL Editor

alter table lists add column if not exists is_active boolean not null default true;

-- All existing lists become active
update lists set is_active = true where is_active is null;
