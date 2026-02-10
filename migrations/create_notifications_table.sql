
-- 1. Create notifications table
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null, -- 'task', 'comment', 'system'
  target_id text, -- ID of the related task or space
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table public.notifications enable row level security;

-- 3. Create RLS Policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Enable Realtime
-- Check if the publication exists first to avoid errors
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

alter publication supabase_realtime add table public.notifications;
