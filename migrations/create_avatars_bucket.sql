
-- 1. Create the 'avatars' bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Allow public access to all avatars
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 3. Allow authenticated users to upload to their own folder
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to update their own avatars
create policy "Owner Update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Allow users to delete their own avatars
create policy "Owner Delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
