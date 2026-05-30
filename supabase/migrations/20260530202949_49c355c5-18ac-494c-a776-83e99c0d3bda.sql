
-- FK relationships so PostgREST can embed profiles
alter table public.listings
  add constraint listings_seller_profile_fk
  foreign key (seller_id) references public.profiles(id) on delete cascade;

alter table public.transactions
  add constraint transactions_buyer_profile_fk
  foreign key (buyer_id) references public.profiles(id) on delete restrict;

alter table public.transactions
  add constraint transactions_seller_profile_fk
  foreign key (seller_id) references public.profiles(id) on delete restrict;

-- Storage bucket for listing photos
insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true);

create policy "Listing images are publicly viewable"
  on storage.objects for select using (bucket_id = 'listing-images');

create policy "Authenticated users can upload to their folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own listing images"
  on storage.objects for update to authenticated
  using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own listing images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);
