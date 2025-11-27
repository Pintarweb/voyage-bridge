-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Policy: Allow authenticated users to upload images
create policy "Allow authenticated users to upload images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'product-images' );

-- Policy: Allow public to view images
create policy "Allow public to view images"
on storage.objects for select
to public
using ( bucket_id = 'product-images' );

-- Policy: Allow users to update their own images
create policy "Allow users to update their own images"
on storage.objects for update
to authenticated
using ( bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1] );

-- Policy: Allow users to delete their own images
create policy "Allow users to delete their own images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1] );
